"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { AiOutlineHome } from "react-icons/ai";
import { IoDocumentTextOutline } from "react-icons/io5";
import { HiOutlineDocumentSearch } from "react-icons/hi";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinkStyle = (path: string) =>
    `md:mr-10 font-semibold text-xl text-white animate-navlinks ${
      pathname === path
        ? "underline decoration-white underline-offset-8 "
        : ""
    }`;

    const smallnavLinkStyle = (path: string) =>
    `font-semibold text-xl w-full ${
      pathname === path
        ? "bg-white text-black rounded-md p-2"
        : "text-white"
    }`;


    return (
        <div>
            <nav className="hidden md:flex flex-row justify-between items-center bg-black w-full p-4 absolute top-0 right-0 left-0 h-[10vh]">
                <h1 className="text-white text-2xl font-bold">OptimaAI</h1>
                <ul className="flex flex-row justify-center p-2 m-auto">
                    <li className={navLinkStyle("/")+"animate-navlinks"}>
                    <Link href="/">Dashboard</Link>
                    </li>

                    <li className={navLinkStyle("/inputform")+"animate-navlinks"}>
                    <Link href="/inputform">Input Form</Link>
                    </li>

                    <li className={navLinkStyle("/auditresults")+"animate-navlinks"}>
                    <Link href="/auditresults">Audit Results</Link>
                    </li>

                    {/* <li className={navLinkStyle("/admin")}>
                    <Link href="/admin">Admin Panel</Link>
                    </li> */}
                </ul>
            </nav>

            <nav className="md:hidden flex flex-row justify-between items-center bg-black w-full p-4 fixed top-0 right-0 left-0 h-[10vh] z-10">
                <h1 className="text-white text-2xl font-bold">OptimaAI</h1>
                <button
                    type="button"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    aria-label="Toggle menu"
                    className="text-2xl text-white font-bold"
                >
                    <RxHamburgerMenu />
                </button>
            </nav>

            {isMenuOpen && (
                <>
                    <div
                            onClick={() => setIsMenuOpen(false)}
                            className="md:hidden fixed inset-0 bg-[#1a1a1a]/70 z-10"
                            aria-hidden="true"
                        />
                    
                    <div className="bg-[#0b0c0e] w-[280px] p-4 fixed top-0 right-0 z-10 h-full">
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(false)}
                            aria-label="Close menu"
                            className="text-2xl text-white font-bold float-right border-2 rounded-md border-white"
                        >
                            <IoClose />
                        </button>
                        <ul className="md:hidden flex flex-col items-start justify-start pt-[80px] gap-6">
                            <li className={smallnavLinkStyle("/")}>
                                <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex flex-row items-center gap-2 ml-4">
                                    <span><AiOutlineHome /></span>
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                            <li className={smallnavLinkStyle("/inputform")}>
                                <Link href="/inputform" onClick={() => setIsMenuOpen(false)} className="flex flex-row items-center gap-2 ml-4">
                                    <span><IoDocumentTextOutline /></span>
                                    <span>Input Form</span>
                                </Link>
                            </li>
                            <li className={smallnavLinkStyle("/auditresults")}>
                                <Link href="/auditresults" onClick={() => setIsMenuOpen(false)}  className="flex flex-row items-center gap-2 ml-4">
                                    <span><HiOutlineDocumentSearch /></span>
                                    <span>Audit Results</span>
                                </Link>
                            </li>
                        </ul>

                    </div>

                </>
            )}
        </div>
    );
}