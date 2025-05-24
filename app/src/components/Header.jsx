import React, { Component, useContext } from "react";

import _ from "lodash";
import { toast } from "react-hot-toast";
import { connect } from "react-redux";
import {
  createSearchParams,
  Link,
  Navigate,
  NavLink,
  useNavigate,
  withRouter,
} from "react-router-dom";
import { Icon } from "@iconify/react";
import loginIcon from "@iconify-icons/carbon/login";
import burgerIcon from "../assets/icons/burger-menu-left.svg";
import chatIcon from "../assets/icons/chat.svg";
import placeholderProfile from "../assets/images/placeholder-profile.jpg";
import logo from "../assets/logo2.png";
import text from "../assets/text2.png";
import { contextAct } from "../redux/slices/context.slice";
import { profileAction } from "../redux/slices/profile.slice";
import { uinfoAct } from "../redux/slices/userInfo.slice";
import { getUserData, isAuthenticated } from "../utils/authUtils";
import withSearchParams from "../utils/wrappers/withSearchParams.js";
import Logout from "./Logout";
import Sidebar from "./Sidebar";

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  profile: state.profile,
});

const mapDispatchToProps = (dispatch) => ({
  assignToken: () => dispatch(uinfoAct.assignToken()),
  dismissToken: () => dispatch(uinfoAct.dismissToken()),
  getProfile: (token, controller) =>
    dispatch(profileAction.getProfileThunk({ token, controller })),
  openLogout: () => dispatch(contextAct.openLogout()),
});

const Navigation = () => {
  const ctx = useContext(contextAct);

  return (
    <Sidebar
      customBurgerIcon={false}
      isOpen={ctx.isMenuOpen}
      onStateChange={(state) => ctx.stateChangeHandler(state)}
    />
  );
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: false,
      isNavbarOpen: false,
      redirectLogout: false,
      isSearchOpen: false,
      inputSearch: "",
    };
    this.dropdownRef = React.createRef();
    this.searchRef = React.createRef();
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleClickOutsideSearch = this.handleClickOutsideSearch.bind(this);
    this.handleKontakScroll = this.handleKontakScroll.bind(this);
  }

  handleKontakScroll(event) {
    event.preventDefault();
    const targetId = "testi-section";
    const targetElement = document.getElementById(targetId);

    if (window.location.pathname === "/") {
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.warn(
          "Element with id '" + targetId + "' not found on the current page."
        );
      }
    } else {
      this.props.navigate("/");
      setTimeout(() => {
        const elementOnTargetPage = document.getElementById(targetId);
        if (elementOnTargetPage) {
          elementOnTargetPage.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        } else {
          console.warn(
            "Element with id '" +
              targetId +
              "' not found after navigating to '/'."
          );
        }
      }, 500);
    }
  }

  navigateTo(path) {
    window.location.href = path;
  }

  componentDidMount() {
    const query = this.props.searchParams.get("q");
    // console.log(query);
    // if (query) {
    this.setState((prevState) => ({
      ...prevState,
      inputSearch: query || "",
    }));
    // }
    document.addEventListener("click", this.handleClickOutside);
    document.addEventListener("click", this.handleClickOutsideSearch);
    // console.log(jwtDecode(this.props.userInfo.token));
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  }

  toggleDropdown() {
    this.setState((prevState) => ({
      isDropdownOpen: !prevState.isDropdownOpen,
    }));
  }

  toggleNavbar = () => {
    this.setState((prevState) => ({
      isNavbarOpen: !prevState.isNavbarOpen,
    }));
  };

  limitCharacters(str) {
    if (str.length > 20) {
      return str.substring(0, 20) + "...";
    }
    return str;
  }

  logoutHandler = () => {
    toast.dismiss();
    this.props.openLogout();
    // toast.promise(
    //   logoutUser(this.props.userInfo.token).then((res) => {
    //     return res.data;
    //   }),
    //   {
    //     loading: "Please wait",
    //     success: () => {
    //       this.setState({ ...this.state, redirectLogout: true });
    //       this.props.dismissToken();
    //       return "Logout has been successful! See ya!";
    //     },
    //     error: (err) => {
    //       console.log(err);
    //       return "Something went wrong, please reload your page!";
    //     },
    //   }
    // );
  };

  handleClickOutside(event) {
    if (
      this.dropdownRef.current &&
      !this.dropdownRef.current.contains(event.target)
    ) {
      this.setState({
        isDropdownOpen: false,
      });
    }
  }

  handleClickOutsideSearch(event) {
    if (
      this.searchRef.current &&
      !this.searchRef.current.contains(event.target)
    ) {
      this.setState({
        isSearchOpen: false,
      });
    }
  }

  render() {
    return (
      <>
        <Logout />
        <div
          className={`${
            this.state.isNavbarOpen ? "translate-x-0" : "translate-x-full"
          } fixed top-0 left-0 w-full h-full bg-black opacity-50 z-[45] transition-opacity duration-300 ease-in-out`}
          onClick={this.toggleNavbar}
        ></div>
        <div
          className={`${
            this.state.isNavbarOpen ? "translate-x-0" : "translate-x-full"
          } transform h-full w-80 bg-white fixed top-0 right-0 z-[60] transition-transform duration-300 ease-in-out`}
        >
          <Sidebar onClose={this.toggleNavbar} />
        </div>
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b-2 border-gray-100">
          <div className=" flex global-px justify-between items-center">
            <div className="py-5 md:py-8">
              <Link to="/" className=" flex flex-row justify-center gap-4">
                <img src={logo} alt="logo" width="30px" />
                <img
                  src={text}
                  alt="logo"
                  width="70px"
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            <div className="navbar-burger select-none cursor-pointer lg:hidden py-4 flex gap-7 flex-row items-center">
              <div
                ref={this.searchRef}
                className="search-section cursor-pointer relative"
                onClick={() =>
                  this.setState((prevState) => ({
                    ...prevState,
                    isSearchOpen: !prevState.isSearchOpen,
                  }))
                }
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 16L12.375 12.375M14.3333 7.66667C14.3333 11.3486 11.3486 14.3333 7.66667 14.3333C3.98477 14.3333 1 11.3486 1 7.66667C1 3.98477 3.98477 1 7.66667 1C11.3486 1 14.3333 3.98477 14.3333 7.66667Z"
                    stroke="#4F5665"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <button onClick={this.toggleNavbar}>
                <img
                  src={burgerIcon}
                  width="30px"
                  className="aspect-square"
                  alt=""
                />
              </button>
            </div>
            <nav className="py-6 hidden lg:flex flex-row gap-8 justify-center">
              <li className="list-none" key="Home Page">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "font-poppins font-medium text-[#000000]" : ""
                  }
                >
                  Home
                </NavLink>
              </li>
              <li className="list-none" key="Product">
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    isActive ? "font-poppins font-medium text-[#000000]" : ""
                  }
                >
                  Produk
                </NavLink>
              </li>
              <li className="list-none" key="Testimoni">
                <a
                  href="/#testi-section"
                  onClick={this.handleKontakScroll}
                  className="font-poppins text-[#4F5665] hover:text-[#000000]"
                >
                  Testimoni
                </a>
              </li>
            </nav>
            {isAuthenticated() ? (
              <div className="flex-row gap-10 hidden lg:flex select-none py-4 items-center">
                <div
                  ref={this.searchRef}
                  className="search-section cursor-pointer relative"
                  onClick={() =>
                    this.setState((prevState) => ({
                      ...prevState,
                      isSearchOpen: !prevState.isSearchOpen,
                    }))
                  }
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 16L12.375 12.375M14.3333 7.66667C14.3333 11.3486 11.3486 14.3333 7.66667 14.3333C3.98477 14.3333 1 11.3486 1 7.66667C1 3.98477 3.98477 1 7.66667 1C11.3486 1 14.3333 3.98477 14.3333 7.66667Z"
                      stroke="#4F5665"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {this.state.isSearchOpen && (
                    <nav
                      className="absolute list-none bg-white rounded-lg shadow-md border-1 border-gray-200 flex flex-col right-0 top-10 py-2 divide-y-1 transition-all duration-200 transform origin-top-right min-w-[14rem]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          // this.props.setSearchParams({
                          //   q: this.state.inputSearch,
                          // });
                          // this.props.navigate("/products");
                          this.props.navigate({
                            pathname: "/products",
                            search: createSearchParams({
                              q: this.state.inputSearch,
                            }).toString(),
                          });
                        }}
                        className="group flex gap-2"
                      >
                        <input
                          value={this.state.inputSearch}
                          onChange={(e) =>
                            this.setState((prevState) => ({
                              ...prevState,
                              inputSearch: e.target.value,
                            }))
                          }
                          placeholder="Search product here..."
                          className="border outline-none focus:border-tertiary px-2 py-2 mx-2 rounded-lg text-sm"
                          required
                        />
                        <button type="submit" className="mr-4">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 17 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16 16L12.375 12.375M14.3333 7.66667C14.3333 11.3486 11.3486 14.3333 7.66667 14.3333C3.98477 14.3333 1 11.3486 1 7.66667C1 3.98477 3.98477 1 7.66667 1C11.3486 1 14.3333 3.98477 14.3333 7.66667Z"
                              stroke="#4F5665"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </form>
                    </nav>
                  )}
                </div>

                <div
                  className="relative flex items-center my-auto"
                  ref={this.dropdownRef}
                  onClick={this.toggleDropdown}
                >
                  <div className=" flex items-center  cursor-pointer">
                    <div className="avatar">
                      <div className="w-9 rounded-full">
                        <img
                          src={
                            this.props?.profile?.data?.img
                              ? this.props.profile.data.img
                              : placeholderProfile
                          }
                        />
                      </div>
                    </div>
                    {/* <img
                      src={
                        this.props?.profile?.data?.img
                          ? this.props.profile.data.img
                          : placeholderProfile
                      }
                      alt=""
                      width="32px"
                      className="rounded-full"
                    /> */}
                    <svg
                      className="w-4 h-4 ml-2"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                  <div
                    className={`dropdown ${
                      this.state.isDropdownOpen
                        ? "transition duration-300 ease-in-out opacity-100 transform -translate-y-6"
                        : "transition duration-200 ease-in-out opacity-0 transform -translate-y-10 invisible"
                    }`}
                  >
                    {this.state.isDropdownOpen && (
                      <nav className="absolute list-none bg-white rounded-lg shadow-md border-1 border-gray-200 flex flex-col right-0 top-10 py-2 divide-y-1 transition-all duration-200 transform origin-top-right min-w-[14rem]">
                        <div className="px-4 py-1">
                          <p>Signed in as</p>
                          <p className="font-medium">
                            {this.limitCharacters(getUserData().email)}
                          </p>
                        </div>
                        <div className="py-1">
                          <NavLink
                            className="block px-4 py-2 hover:bg-gray-100  duration-200"
                            to="/profile/"
                          >
                            Profile
                          </NavLink>
                          {/* <a
                          className="block px-4 py-2 hover:bg-gray-100 duration-200"
                          href="#"
                        >
                          My Cart
                        </a> */}
                        </div>
                        {Number(this.props.userInfo.role) > 1 && (
                          <div className="py-1">
                            <NavLink
                              className="block px-4 py-2 hover:bg-gray-100  duration-200"
                              to="/manage-order"
                            >
                              Manage Order
                            </NavLink>
                            <NavLink
                              className="block px-4 py-2 hover:bg-gray-100  duration-200"
                              to="/products/new"
                            >
                              Add Product
                            </NavLink>
                            <NavLink
                              className="block px-4 py-2 hover:bg-gray-100  duration-200"
                              to="/promo/new"
                            >
                              Add Promo
                            </NavLink>
                            <NavLink
                              className="block px-4 py-2 hover:bg-gray-100  duration-200"
                              to="/gallery/new"
                            >
                              Add Galery
                            </NavLink>
                            <NavLink
                              className="block px-4 py-2 hover:bg-gray-100  duration-200"
                              to="/testi/new"
                            >
                              Add Testimoni
                            </NavLink>
                          </div>
                        )}
                        {Number(this.props.userInfo.role) === 1 ? (
                          <div className="py-1">
                            <NavLink
                              className="block px-4 py-2 hover:bg-gray-100 duration-200"
                              to="/history"
                            >
                              Order
                            </NavLink>
                          </div>
                        ) : null}

                        <div className="py-1">
                          <a
                            className="block px-4 py-2 hover:bg-gray-100 duration-200 cursor-pointer"
                            onClick={this.logoutHandler}
                          >
                            Sign out
                          </a>
                        </div>
                      </nav>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-full bg-secondary px-6 py-3 text-tertiary font-poppins hover:bg-secondary-150 duration-250 flex items-center justify-center">
                <Icon
                  icon={loginIcon}
                  className="text-xl text-[#ffffff]"
                ></Icon>
                <Link
                  to="/auth/login"
                  className="font-poppins text-center w-full text-[#ffffff]"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </header>
        {this.state.redirectLogout && (
          <Navigate to="/auth/login" replace={true} />
        )}
      </>
    );
  }
}

export default withSearchParams(
  connect(mapStateToProps, mapDispatchToProps)(Header)
);
