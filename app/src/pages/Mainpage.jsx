import React, { Component, Fragment } from "react";

import { Link } from "react-router-dom";
import MenuSection from "./Products/MenuSlide.jsx";
import Galery from "./Galery/galery.jsx";
import Testi from "./Testi/testi.jsx";
import { Navigation } from "swiper/modules";
import { Icon } from "@iconify/react";
import locate from "@iconify-icons/mdi/location";
import contact from "@iconify-icons/mdi/phone-in-talk-outline";
import food1 from "../assets/food2.png";
import checkCircle from "../assets/icons/check-circle.svg";
import checkIcon from "../assets/icons/check.svg";
import loveIcon from "../assets/icons/love.svg";
import placeIcon from "../assets/icons/place.svg";
import ciClock from "@iconify-icons/ci/clock";
import starIcon from "../assets/icons/star.svg";
import staffIcon from "../assets/icons/user.svg";
import mapImage from "../assets/images/global.svg";
import amazonLogo from "../assets/images/partners/amazon.svg";
import discordLogo from "../assets/images/partners/discord.svg";
import netflixLogo from "../assets/images/partners/netflix.svg";
import redditLogo from "../assets/images/partners/reddit.svg";
import spotifyLogo from "../assets/images/partners/spotify.svg";
import phProfile from "../assets/images/placeholder-profile.jpg";
import productImage1 from "../assets/images/product-1.webp";
// assets images
import provideImage from "../assets/images/team-work.webp";
// components
import Footer from "../components/Footer";
import Header from "../components/Header";

class Mainpage extends Component {
  state = {
    provide: [
      "Biji berkualitas tinggi",
      "Makanan sehat, Anda bisa meminta bahan-bahannya",
      "Chat dengan staf kami untuk pengalaman memesan yang lebih baik",
      "Kartu member gratis dengan minimal pembelian Rp 200.000.",
    ],
    reviews: [
      {
        name: "Foo Barr",
        text: "Wow... Saya sangat senang menghabiskan sepanjang hari di sini. Wi-Finya bagus, kopi dan makanannya juga. Saya suka di sini!! Sangat direkomendasikan!",
      },
      {
        name: "Yessica Christy",
        text: "Saya suka karena saya suka bepergian jauh dan tetap bisa membuat hari saya lebih baik hanya dengan meminum Hazelnut Latte mereka.",
      },
      {
        name: "Kim Young Jou",
        text: "Ini sangat tidak biasa untuk selera saya, sebelumnya saya tidak suka kopi tapi kopi mereka adalah yang terbaik! Dan ya, Anda harus memesan sayap ayam, yang terbaik di kota.",
      },
    ],
  };

  render() {
    return (
      <Fragment>
        <Header />
        <main>
          <section className="flex gap-10 p-10 max-md:flex-col max-md:p-5 max-sm:gap-5 max-sm:p-4">
            <div className="global-px">
              <section className="flex gap-10 p-10 max-md:flex-col max-md:p-5 max-sm:gap-5 max-sm:p-4">
                <div className="flex-1 max-sm:text-center">
                  <h3 className="mb-5 text-5xl font-poppins font-bold">
                    NiYo Cafe
                  </h3>
                  <h3 className="mb-5 text-5xl font-poppins font-bold">
                    Rekomendasi
                  </h3>
                  <p className="text-5xl">
                    <span className="font-lobster-two font-bold italic text-gray-500">
                      Cafe
                    </span>{" "}
                    <span className="inline-block font-poppins font-bold text-black text-5xl">
                      &
                    </span>{" "}
                    <span className="font-lobster-two font-bold italic text-gray-500">
                      Resto
                    </span>{" "}
                    <span className="font-poppins font-bold text-gray-900">
                      Pilihan
                    </span>
                  </p>

                  <p className="mb-8 font-poppins text-stone-500">
                    Tempat kehangatan kopi bertemu dengan suasana nyaman.
                    Nikmati berbagai varian kopi pilihan yang disajikan dengan
                    cinta dan kualitas terbaik.
                  </p>
                  <div className="flex gap-5 items-center max-sm:flex-col max-sm:gap-4 max-sm:items-center">
                    <button className="px-5 py-2.5 text-white bg-black rounded-3xl cursor-pointer">
                      Lihat Selengkapnya
                    </button>
                    <div className="flex gap-2.5 items-center font-poppins font-semibold">
                      <img
                        src={staffIcon}
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                      <p>Gerald Arnov</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1">
                  <img
                    src={food1}
                    alt="Featured dish"
                    className="max-w-full drop-shadow-[0_20px_25px_rgba(0,0,0,0.3)] "
                  />
                </div>
              </section>
              <section className="relative bg-white mt-20 mb-[-9rem] rounded-xl shadow-xl text-quartenary flex flex-row py-5 justify-center items-center text-center md:text-left">
                <aside className="flex-1 border-r-2 py-2 md:py-6 flex flex-col items-center gap-3">
                  <div className="bg-secondary rounded-full p-3 w-12 h-12 flex justify-center items-center">
                    <Icon
                      icon={ciClock}
                      className="text-xl text-[#ffffff]"
                    ></Icon>
                  </div>

                  <div className="text-center">
                    <p className="text-md font-semibold text-gray-800">
                      Setiap Hari 08.00 - 00.00
                    </p>
                    <p className="font-normal text-gray-500">Jam Buka</p>
                  </div>
                </aside>

                <aside className="flex-1 border-r-2 py-2 md:py-6 flex flex-col items-center gap-3">
                  <div className="bg-secondary rounded-full p-3 w-12 h-12 flex justify-center items-center">
                    <Icon
                      icon={locate}
                      className="text-xl text-[#ffffff]"
                    ></Icon>
                  </div>

                  <div className="text-center">
                    <p className="text-md font-semibold text-gray-800">
                      Jl. Cokro Sujono, Jogoyudan, Kec. Lumajang
                    </p>
                    <p className="font-normal text-gray-500">Lokasi</p>
                  </div>
                </aside>

                <aside className="flex-1 border-r-2 py-2 md:py-6 flex flex-col items-center gap-3">
                  <div className="bg-secondary rounded-full p-3 w-12 h-12 flex justify-center items-center">
                    <Icon
                      icon={contact}
                      className="text-xl text-[#ffffff]"
                    ></Icon>
                  </div>

                  <div className="text-center">
                    <p className="text-md font-semibold text-gray-800">
                      0823-3809-8770
                    </p>
                    <p className="font-normal text-gray-500">Kontak</p>
                  </div>
                </aside>
              </section>
            </div>
          </section>
          <div className="mb-8 md:mb-20"></div>
          <section className="flex flex-col lg:flex-row global-px py-20 lg:gap-32">
            <div className="w-full h-[400px] mb-8 overflow-hidden rounded-xl shadow-lg">
              <iframe
                className="w-full h-full"
                src="https://www.google.com/maps?q=-8.134918916217753,113.22883926585584&hl=es;z=14&output=embed"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </section>
          <section className="global-px py-8 md:py-20">
            <div className="flex flex-col items-center">
              <h2 className="text-4xl text-quartenary font-poppins font-semibold mb-5 text-center">
                Favorit Pelanggan
              </h2>
            </div>
            <div className="mx-auto my-0 bg-white max-w-[1440px] font-['Montserrat']">
              <MenuSection />
            </div>
            <div className="mx-auto my-0 bg-white max-w-[1440px] font-['Montserrat']">
              <Galery />
            </div>
            <div
              id="testi-section"
              className="mx-auto my-0 bg-white max-w-[1440px] font-['Montserrat']"
            >
              <Testi />
            </div>
          </section>

          {/* <section className="global-px py-8 md:py-20">
            <div className="flex flex-col items-center mb-8 md:mb-20 text-center">
              <h2 className="text-3xl md:text-[35px] text-quartenary font-poppins font-semibold mb-5">
                Disukai oleh Pelanggan
                <br /> Kami yang Bahagia
              </h2>
              <p className="text-[1rem] text-center max-w-[555px] text-primary">
                Ini adalah cerita dari pelanggan kami yang telah berkunjung dengan senang hati.
              </p>
            </div>
            <div className="overflow-auto flex flex-row gap-5 flex-wrap lg:flex-nowrap ">
              {this.state.reviews.map((review, idx) => {
                return (
                  <div
                    className="w-[400px] border-gray-300 hover:border-tertiary border-2 duration-200 rounded-xl p-7 space-y-4 hover:shadow-2xl mx-auto"
                    key={idx}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <img
                        src={phProfile}
                        alt=""
                        className="w-14 aspect-square object-cover rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-poppins font-semibold text-quartenary text-lg">
                          {review.name}
                        </p>
                        <p className="text-primary text-sm">Warsaw, Poland</p>
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        4.5 <img src={starIcon} alt="" />
                      </div>
                    </div>
                    <p className="text-quartenary">“{review.text}</p>
                  </div>
                );
              })}
            </div>
          </section> */}
          <section className="global-px z-10 relative w-full mb-6 md:mb-[-6rem]">
            <div className="shadow-primary rounded-xl flex flex-col md:flex-row py-10 md:py-14 px-8 md:px-16 bg-white text-center md:text-left">
              <aside className="flex-1 space-y-4 mb-5 md:mb-0">
                <p className="text-3xl font-poppins font-semibold">
                  Check Promo Hari ini!
                </p>
                <p className="text-primary">
                  Ayo lihat penawarannya dan pilih milikmu
                </p>
              </aside>
              <aside className="hidden lg:block lg:flex-1"></aside>
              <aside className="flex-1 flex flex-col justify-center text-xl text-[#ffffff]">
                <button
                  onClick={() => (window.location.href = "/products")}
                  className="rounded-full bg-secondary px-6 py-3 text-tertiary font-poppins hover:bg-secondary-150 duration-250 flex items-center justify-center"
                >
                  Lihat promo
                </button>
              </aside>
            </div>
          </section>
        </main>
        <Footer />
      </Fragment>
    );
  }
}

export default Mainpage;
