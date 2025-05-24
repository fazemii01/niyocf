import React, { Component } from "react";

import { Link } from "react-router-dom";

import fbLogo from "../assets/icons/facebook.svg";
import igLogo from "../assets/icons/instagram.svg";
import twLogo from "../assets/icons/twitter.svg";
import logo from "../assets/logo.svg";

class Footer extends Component {
  render() {
    return (
      <footer className="bg-[#F8F8F8] text-[#4f5665]">
        <div className="global-px">
          <div className="py-5  md:py-20"></div>
          <div className="flex flex-col-reverse gap-12 md:flex-row">
            <div className="flex flex-col gap-4 md:flex-[2_2_0%]">
              <Link to="/">
                <div className="font-extrabold flex flex-row gap-2">
                  <img src={logo} alt="logo" width="30px" />{" "}
                  <h1 className="text-xl text-black">niyo cafe.</h1>
                </div>
              </Link>
              <div className="md:w-96">
                niyo cafe is a store that sells some good meals, and especially
                coffee & seblak.
              </div>
              <div className="flex flex-row gap-5">
                <a
                  href="#"
                  className="bg-tertiary h-[35px] w-[35px] flex items-center justify-center rounded-full"
                >
                  <img src={fbLogo} alt="" />
                </a>
                <a
                  href="https://www.instagram.com/niyo.coffee/?hl=en"
                  className="bg-tertiary h-[35px] w-[35px] flex items-center justify-center rounded-full"
                >
                  <img src={igLogo} alt="" />
                </a>
                <a
                  href="#"
                  className="bg-tertiary h-[35px] w-[35px] flex items-center justify-center rounded-full"
                >
                  <img src={twLogo} alt="" width="120%" className="w-16" />
                </a>
              </div>
              <div className="copyright">(c) 2025 niyo cafe</div>
            </div>
            <nav className="flex flex-row gap-10 md:flex-1">
              <div className="flex-1 flex flex-col gap-5">
                <div className="grid-item">
                  <h4 className="font-bold">Produk</h4>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="grid-item">
                    <a
                      href="https://"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Lokasi
                    </a>
                  </div>
                  <div className="grid-item">
                    <a
                      href="https://"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Galery
                    </a>
                  </div>
                  <div className="grid-item">
                    <a
                      href="https://"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Produk
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-5">
                <div className="grid-item">
                  <h4 className="font-bold">Mulai</h4>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="grid-item">
                    <a
                      href="https://"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Coffee Shop ?
                    </a>
                  </div>
                  <div className="grid-item">
                    <a
                      href="https://"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      FAQ
                    </a>
                  </div>
                  <div className="grid-item">
                    <a
                      href="https://"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      About Us
                    </a>
                  </div>
                </div>
              </div>
            </nav>
          </div>
          <div className="py-5"></div>
        </div>
      </footer>
    );
  }
}

export default Footer;
