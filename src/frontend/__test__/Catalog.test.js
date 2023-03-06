import {render, screen, waitFor} from "@testing-library/react"
import {mockBrandData} from "./mockProductData";
import ProductService from "../utilities/product-service";
import Catalog from "../components/Catalog";
import {BrowserRouter} from "react-router-dom";
import userEvent from "@testing-library/user-event";

jest.mock("../utilities/product-service")
jest.mock("axios")


describe("Sort and filter functionality on catalog", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        ProductService.getBrandList.mockResolvedValue(
            { data : {
                    brandList : []
                }
            })
        ProductService.getQuery.mockResolvedValue({
            data: {
                products: []
            }
        })
    })
    test("Should render brand list.", async () => {
        ProductService.getBrandList.mockResolvedValue(mockBrandData)
        const tree = render(
            <BrowserRouter>
                <Catalog />
            </BrowserRouter>
        )
        const brandButton = await waitFor(() => screen.getAllByText(/Mockular/i))
        expect(brandButton).toBeDefined()
        mockBrandData.data.brandList.map(async brand => {
            const currentBrand = screen.getAllByText(brand)
            expect(currentBrand[0]).toBeDefined()
        })
        expect(tree).toMatchSnapshot()
    })

    test("Clicking a brand button should generate a query string", async () => {
        ProductService.getBrandList.mockResolvedValue(mockBrandData)
        render(
            <BrowserRouter>
                <Catalog />
            </BrowserRouter>
        )
        const brandButton = await waitFor(() => screen.getAllByText(/Mockular/i))
        expect(brandButton).toBeDefined()
        const spy = jest.spyOn(ProductService, "getQuery")
        await userEvent.click(brandButton[0])
        expect(spy).toBeCalled()
        expect(spy).toHaveBeenLastCalledWith("?page=0&filters={\"price\":[],\"brand\":[\"Mockular\"]}")
    })

    test("Inputting low and high number values should result in a price filter", async () => {
        const {container} = render(
            <BrowserRouter>
                <Catalog />
            </BrowserRouter>
        )
        await waitFor(() => {screen.getAllByText(/Brand/i)})
        const spy = jest.spyOn(ProductService, "getQuery")
        const lowValueBox = container.querySelector(".price-low")
        const highValueBox = container.querySelector(".price-high")
        const updateButton = screen.getAllByText(/Update/i)
        expect(lowValueBox).toBeDefined()
        expect(highValueBox).toBeDefined()
        lowValueBox.value = 30
        highValueBox.value = 70
        await userEvent.click(updateButton[0])
        expect(spy)
            .toHaveBeenLastCalledWith("?page=0&filters={\"price\":[{\"lowValue\":30,\"highValue\":70}],\"brand\":[]}")
    })

    test("Clicking a sort button adds a sort query to the query string", async () => {
        render(
            <BrowserRouter>
                <Catalog />
            </BrowserRouter>
        )
        await waitFor(() => {screen.getAllByText(/A-Z/i)})
        const sortButton = screen.getAllByText(/A-Z/i)
        const spy = jest.spyOn(ProductService, "getQuery")
        await userEvent.click(sortButton[0])
        expect(spy).toHaveBeenLastCalledWith("?page=0&sort=name,1")
    })

    test("Combining multiple filters and sorts creates a combined query string", async () => {
        ProductService.getBrandList.mockResolvedValue(mockBrandData)
        const {container} = render(
            <BrowserRouter>
                <Catalog />
            </BrowserRouter>
        )
        const brandButton = await waitFor(() => screen.getAllByText(/Mockular/i))
        const brandButton2 = screen.getAllByText(/Fuzzfest/i)
        const sortButton = screen.getAllByText(/A-Z/i)
        const lowValueBox = container.querySelector(".price-low")
        const highValueBox = container.querySelector(".price-high")
        const updateButton = screen.getAllByText(/Update/i)
        const spy = jest.spyOn(ProductService, "getQuery")

        await userEvent.click(brandButton[0])
        await userEvent.click(brandButton2[0])
        await userEvent.click(sortButton[0])
        lowValueBox.value = 20
        highValueBox.value = 50
        await userEvent.click(updateButton[0])
        expect(spy).toHaveBeenLastCalledWith("?page=0&sort=name,1" +
            "&filters={\"price\":[{\"lowValue\":20,\"highValue\":50}],\"brand\":[\"Mockular\",\"Fuzzfest\"]}"
        )
        /**
         * Should be called 5 times:
         * 1. Initial call on catalog render
         * 2. First brand button click
         * 3. Second brand button click
         * 4. Sort button click
         * 5. Price filter update button click
         */
        expect(spy).toHaveBeenCalledTimes(5)
    })
})

