import ProductService from "../utilities/product-service"
import {render, screen, waitFor} from "@testing-library/react"
import {mockProductData} from "./mockProductData";
import ProductPage from "../components/ProductPage"
import Reviews from "../components/Reviews"
import {BrowserRouter} from "react-router-dom";
import {StateProvider, useStateValue, StateContext} from "../StateProvider"
import reducer, { initialState } from '../reducer.js'
import userEvent from "@testing-library/user-event";

jest.mock("../utilities/product-service")

beforeEach(() => {
    jest.clearAllMocks()
    ProductService.getById.mockResolvedValue({ data : mockProductData.data.products[1]})
})

test("Snapshot of rendered page", async () => {
    const tree = render(
        <StateProvider initialState={initialState} reducer={reducer}>
            <BrowserRouter >
                <ProductPage />
            </BrowserRouter>
        </StateProvider>
    )
    await waitFor(() => screen.getAllByTestId(/StarIcon/i))
    expect(tree).toMatchSnapshot()
})

test("Snapshot of page with invalid id", async () => {
    ProductService.getById.mockResolvedValueOnce({ data : {}})
    const tree = render(
        <StateProvider initialState={initialState} reducer={reducer}>
            <BrowserRouter >
                <ProductPage />
            </BrowserRouter>
        </StateProvider>
    )
    const notTitle = screen.queryByText(/FloofFloof/i)
    const errorTitle = screen.queryByText(/Product not found/i)
    expect(notTitle).toBeNull()
    expect(errorTitle).not.toBeNull()
    expect(tree).toMatchSnapshot()
})

test("Check if review score is correct", async () => {
    render(
        <StateProvider initialState={initialState} reducer={reducer}>
            <BrowserRouter >
                <ProductPage />
            </BrowserRouter>
        </StateProvider>
    )
    await waitFor(() => screen.getByText(/FloofFloof/i))
    const starIcons = await waitFor(() => screen.getAllByTestId("StarIcon"))
    const halfStarIcon = screen.getByTestId("StarHalfIcon")
    const starOutlineIcons = screen.getAllByTestId("StarOutlineIcon")
    expect(starIcons.length).toEqual(1)
    expect(halfStarIcon).toBeDefined()
    expect(starOutlineIcons.length).toEqual(3)

})

test("User submits a product to the shopping basket", async () => {
    const {container} = render(
        <StateProvider initialState={initialState} reducer={reducer}>
            <BrowserRouter >
                <ProductPage />
            </BrowserRouter>
        </StateProvider>
    )
    await waitFor(() => screen.getAllByTestId("StarIcon"))
    container.querySelector("#input-quantity").value = 1
    const checkoutButton = screen.getByText(/Add to Checkout/i)
    await userEvent.click(checkoutButton)
    expect(container.querySelector("#input-quantity").value).toEqual("1")
})

test("Review section snapshot", async () => {
    const tree = render(
        <StateProvider initialState={initialState} reducer={reducer}>
            <BrowserRouter >
                <Reviews  reviewScore={mockProductData.data.products[1].reviewScore}
                          reviewCount={mockProductData.data.products[1].reviewCount}
                          reviews={mockProductData.data.products[1].reviews}
                          productId={mockProductData.data.products[1]._id}/>
            </BrowserRouter>
        </StateProvider>
    )
    await waitFor(() => screen.getByText(/2 Reviews/i))
    expect(tree).toMatchSnapshot()
})

test("Reviews can not be written if not logged in", async () => {
    render(
        <StateProvider initialState={initialState} reducer={reducer}>
            <BrowserRouter >
                <Reviews  reviewScore={mockProductData.data.products[1].reviewScore}
                          reviewCount={mockProductData.data.products[1].reviewCount}
                          reviews={mockProductData.data.products[1].reviews}
                          productId={mockProductData.data.products[1]._id}/>
            </BrowserRouter>
        </StateProvider>
    )
    await waitFor(() => screen.getByText(/2 Reviews/i))
    const loggedInQuery = screen.queryByText(/you will need to log in/i)
    expect(loggedInQuery).toBeDefined()
})

test("User can write review if logged in.", async () => {
    const {container} = render(
        <StateProvider initialState={{loggedinuser: {
            _id:"abc123"
            }}} reducer={reducer}>
            <BrowserRouter >
                <Reviews  reviewScore={mockProductData.data.products[1].reviewScore}
                          reviewCount={mockProductData.data.products[1].reviewCount}
                          reviews={mockProductData.data.products[1].reviews}
                          productId={mockProductData.data.products[1]._id}/>
            </BrowserRouter>
        </StateProvider>
    )
    await waitFor(() => screen.getByText(/Write a review!/i))
    const ratingDropdown = container.querySelector("#review-rating")
    expect(ratingDropdown).toBeDefined()
})

test("User submits a review", async () => {
    const {container} = render(
        <StateProvider initialState={{loggedinuser: {
                _id:"abc123"
            }}} reducer={reducer}>
            <BrowserRouter >
                <Reviews  reviewScore={mockProductData.data.products[1].reviewScore}
                          reviewCount={mockProductData.data.products[1].reviewCount}
                          reviews={mockProductData.data.products[1].reviews}
                          productId={mockProductData.data.products[1]._id}/>
            </BrowserRouter>
        </StateProvider>
    )
    await waitFor(() => screen.getByText(/Write a review!/i))
    const reviewTitle = container.querySelector("#review-title")
    const reviewRating = container.querySelector("#review-rating")
    const reviewDescription = container.querySelector("#review-description")
    const reviewSubmit = container.querySelector("#review-submit")
    const spy = jest.spyOn(ProductService, "submitReview").mockResolvedValueOnce("submitted")

    reviewTitle.value = "Test Review"
    reviewRating.value = 5
    reviewDescription.value = "What a great test review. Would test this review again."
    await userEvent.click(reviewSubmit)

    expect(spy).toHaveBeenCalledTimes(1)
})

