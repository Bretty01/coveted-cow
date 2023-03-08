import {render, screen, waitFor} from "@testing-library/react"
import {mockUser} from "./mockUserData"
import {mockProductData} from "./mockProductData";
import Header from "../components/Header"
import {StateProvider, useStateValue, StateContext} from "../StateProvider"
import reducer, { initialState } from '../reducer.js'
import userEvent from "@testing-library/user-event"
import {BrowserRouter} from "react-router-dom";
import UserService from "../utilities/UserService"

jest.mock("../utilities/UserService")

test("User is not logged in header snapshot", () => {
    const tree = render(
        <StateProvider initialState={initialState} reducer={reducer}>
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        </StateProvider>
    )
    expect(tree).toMatchSnapshot()
})

test("User is logged in with items in basket snapshot", () => {
    const tree = render(
        <StateProvider initialState={{basket:[mockProductData.data.products[0]],
            loggedinuser: mockUser}} reducer={reducer}>
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        </StateProvider>
    )
    expect(tree).toMatchSnapshot()
})

test("Correct shopping cart items is displayed", () => {
    const {container} = render(
        <StateProvider initialState={{basket:[mockProductData.data.products[0], mockProductData.data.products[1],
                mockProductData.data.products[2]],
            loggedinuser: mockUser}} reducer={reducer}>
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        </StateProvider>
    )
    const basketCount = container.querySelector(".header-productCount").innerHTML
    expect(basketCount).toEqual("3")
})

test("'Sign Out is clicked to sign out the user'", async () => {
    const spy = jest.spyOn(UserService, "deleteCookie").mockResolvedValue("deleted")
    const {container} = render(
        <StateProvider initialState={{loggedinuser: mockUser}} reducer={reducer}>
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        </StateProvider>
    )
    await waitFor(() => {screen.getAllByText(/Sign Out/i)})
    const signOut = container.querySelector(".header_option")
    await userEvent.click(signOut)
    const signIn = await waitFor(() => screen.getAllByText(/Sign In/i))
    expect(signIn).toBeDefined()
    expect(spy).toBeCalledTimes(1)
})

test("Mobile search bar becomes visible on click of search icon", async () => {
    const {container} =  render(
        <StateProvider initialState={initialState} reducer={reducer}>
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        </StateProvider>
    )
    const searchbar = container.querySelector("#mobile-searchbar")
    expect(searchbar.className).not.toEqual("visible")
    const searchIcon = container.querySelector(".header-searchIcon")
    await userEvent.click(searchIcon)
    expect(searchbar.className).toEqual("visible")
})
