"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useState } from "react";

import { Menu, X } from "lucide-react";
import { SigninForm } from "../forms/SigninForm";
import { SignupForm } from "../forms/SignupForm";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="flex flex-col items-center min-h-screen min-w-screen w-full bg-gray-50">
      {/* Navbar */}
      <nav className="w-full py-4 px-6 bg-white shadow-md fixed top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-primary">
            BudgetApp
          </Link>

          {/* Menu Mobile */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex space-x-4">
            <Button variant="ghost" asChild>
              <Link href="#features">Fonctionnalités</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="#pricing">Tarifs</Link>
            </Button>
            <Button asChild>
              <Link href="#auth">Se connecter</Link>
            </Button>
          </div>
        </div>

        {/* Menu Mobile Expandable */}
        {menuOpen && (
          <div className="md:hidden flex flex-col mt-4 space-y-2 bg-white p-4 shadow-md">
            <Button variant="ghost" asChild>
              <Link href="#features">Fonctionnalités</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="#pricing">Tarifs</Link>
            </Button>
            <Button asChild>
              <Link href="#auth">Se connecter</Link>
            </Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="w-full flex flex-col items-center text-center mt-20 p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold">
          Gérez votre budget en toute simplicité.
        </h1>
        <p className="text-gray-600 max-w-lg mt-4 text-sm md:text-base">
          Suivez vos dépenses, planifiez votre avenir financier et économisez
          plus intelligemment.
        </p>
        <Button size="lg" className="mt-6">
          Commencer gratuitement
        </Button>
      </header>

      {/* Auth Section */}
      <section
        id="auth"
        className="w-full flex flex-col items-center justify-center gap-6 md:gap-10 md:p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-7 w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Connexion */}
          <section className="w-full h-full flex flex-col justify-center items-center p-6 md:p-8 col-span-3">
            <h2 className="text-xl md:text-2xl font-bold">Se connecter</h2>
            <SigninForm />
          </section>

          {/* Séparateur */}
          <section className="w-full h-full flex justify-center items-center">
            <Separator orientation="horizontal" className="md:hidden w-2/3" />
            <Separator orientation="vertical" className="hidden md:block" />
          </section>

          {/* Inscription */}
          <section className="w-full h-full flex flex-col justify-center items-center p-6 md:p-8 col-span-3">
            <h2 className="text-xl md:text-2xl font-bold">Créer un compte</h2>
            <SignupForm />
          </section>
        </div>
      </section>
    </main>
  );
}
