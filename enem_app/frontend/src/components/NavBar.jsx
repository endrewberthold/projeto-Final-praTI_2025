import React, { useState } from 'react';
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md';
import { GoHome, GoHomeFill } from 'react-icons/go';
import { LuCrown } from 'react-icons/lu';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
  const [selecionado, setSelecionado] = useState('home');

  return (
    <div className="navbar-container">
      <div id="navbar">
        <div id="navbar-interno">
          <div id="botoes">
            <NavLink
              to="/flashcards"
              className="nav-botao"
              onClick={() => {
                setSelecionado('bookmark');
              }}
            >
              {selecionado === 'bookmark' ? (
                <MdBookmark size={'2rem'} />
              ) : (
                <MdBookmarkBorder size={'1.5rem'} />
              )}
            </NavLink>

            <NavLink
              to="/"
              className="nav-botao"
              onClick={() => {
                setSelecionado('home');
              }}
            >
              {selecionado === 'home' ? (
                <GoHomeFill size={'2rem'} />
              ) : (
                <GoHome size={'1.5rem'} />
              )}
            </NavLink>

            <NavLink
              to="/userStatus"
              className="nav-botao"
              onClick={() => {
                setSelecionado('crown');
              }}
            >
              {selecionado === 'crown' ? (
                <LuCrown size={'2rem'} fill="black" />
              ) : (
                <LuCrown size={'1.5rem'} />
              )}
            </NavLink>
          </div>

          <input type="checkbox" className="theme-checkbox" />
        </div>
      </div>
    </div>
  );
}
