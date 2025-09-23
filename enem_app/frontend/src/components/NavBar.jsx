import React, { useRef, useEffect, useState } from "react";
import "../styles/components/navbar.sass";
import { PiCards } from "react-icons/pi";
import { BsPerson } from "react-icons/bs";
import { BsGrid } from "react-icons/bs";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const menuRef = useRef(null);
  const menuBorderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);

  const firstLoad = useRef(true);

  useEffect(() => {
    const menuBorder = menuBorderRef.current;

    if (firstLoad.current) {
      // Primeiro carregamento: sem transição
      menuBorder.style.transition = "none";
      offsetMenuBorder();

      // Ativa a transição para os próximos cliques
      requestAnimationFrame(() => {
        menuBorder.style.transition = "";
        firstLoad.current = false;
      });
    } else {
      // Depois do primeiro carregamento: desliza normalmente
      offsetMenuBorder();
    }

    const handleResize = () => {
      menuBorder.style.transition = "none";
      offsetMenuBorder();
      requestAnimationFrame(() => {
        menuBorder.style.transition = "";
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIndex]);

  const offsetMenuBorder = () => {
    const menu = menuRef.current;
    const menuBorder = menuBorderRef.current;
    const activeItem = menu.children[activeIndex];

    if (!activeItem || !menuBorder) return;

    // Pega posição do item ativo e do menu na viewport
    const offsetActiveItem = activeItem.getBoundingClientRect();
    const offsetMenu = menu.getBoundingClientRect();

    // Calcula posição relativa do item dentro do menu
    const left =
      Math.floor(
        offsetActiveItem.left -
          offsetMenu.left -
          (menuBorder.offsetWidth - offsetActiveItem.width) / 2
      ) + "px";

    // Move a borda para centralizar no item ativo
    menuBorder.style.transform = `translate3d(${left}, 0, 0)`;
  };

  const handleClick = (index) => {
    menuRef.current.style.removeProperty("--timeOut");
    setActiveIndex(index);
  };

  return (
    <>
      <div className="navbar-container">
        <div style={{ width: "20rem" }}></div>{" "}
        {/* espaço à esquerda, pode ser vazio */}
        <menu className="menu" ref={menuRef}>
          <NavLink to="/userStatusPage">
             <button
                className={`menu__item${activeIndex === 0 ? " active" : ""}`}
                style={{ "--bgColorItem": "#668fccff" }}
                onClick={() => handleClick(0)}
              >
              <svg 
              className="icon" 
              viewBox="0 0 24 24" 
              fill="#ffffffff">
              <BsPerson 
                fill="#fff"
                size={23}
              />
              </svg>
            </button>
          </NavLink>
         
          <NavLink to="/dashboard">
            <button
              className={`menu__item${activeIndex === 1 ? " active" : ""}`}
              style={{ "--bgColorItem": "#668fccff" }}
              onClick={() => handleClick(1)}
            >
            <svg 
             className="icon"
             viewBox="0 0 24 24"
             >
              <BsGrid
                color="#ffff"
                size={23}
              />
            </svg>
          </button>
          
          </NavLink>
          
           <NavLink to="/flashcardPage">
            <button
              className={`menu__item${activeIndex === 2 ? " active" : ""}`}
              style={{ "--bgColorItem": "#668fccff" }}
              onClick={() => handleClick(2)}
            >
              <svg className="icon" viewBox="0 0 24 24" fill="#4e6dc2ff">
                <PiCards
                  fill="#ffffffff"
                  size={23}
                />
              </svg>
            </button>
            <div className="menu__border" ref={menuBorderRef}></div>

           </NavLink>
          
          {/* Menu lateral */}
          <div className="iconesLateral">
            <div className="icone-conteiner">
              <div className="button">
                <label
                  for="themeToggle"
                  className="themeToggle st-sunMoonThemeToggleBtn"
                  type="checkbox"
                >
                  <input
                    type="checkbox"
                    id="themeToggle"
                    className="themeToggleInput"
                  />
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    stroke="none"
                  >
                    <mask id="moon-mask">
                      <rect
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        fill="white"
                      ></rect>
                      <circle cx="11" cy="3" r="8" fill="black"></circle>
                    </mask>
                    <circle
                      class="sunMoon"
                      cx="10"
                      cy="10"
                      r="8"
                      mask="url(#moon-mask)"
                    ></circle>
                    <g>
                      <circle
                        class="sunRay sunRay1"
                        cx="18"
                        cy="10"
                        r="1.5"
                      ></circle>
                      <circle
                        class="sunRay sunRay2"
                        cx="14"
                        cy="16.928"
                        r="1.5"
                      ></circle>
                      <circle
                        class="sunRay sunRay3"
                        cx="6"
                        cy="16.928"
                        r="1.5"
                      ></circle>
                      <circle
                        class="sunRay sunRay4"
                        cx="2"
                        cy="10"
                        r="1.5"
                      ></circle>
                      <circle
                        class="sunRay sunRay5"
                        cx="6"
                        cy="3.1718"
                        r="1.5"
                      ></circle>
                      <circle
                        class="sunRay sunRay6"
                        cx="14"
                        cy="3.1718"
                        r="1.5"
                      ></circle>
                    </g>
                  </svg>
                </label>
              </div>
              {/* <button className="button">
                <svg viewBox="0 0 448 512" class="bell">
                  <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path>
                </svg>
              </button> */}
{/* 
              <button className="button" id="icone-configuracao">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  viewBox="0 0 20 20"
                  height="20"
                  fill="none"
                  class="svg-icon"
                >
                  <g
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke="#ffffffff"
                  >
                    <circle r="2.5" cy="10" cx="10"></circle>
                    <path
                      fill-rule="evenodd"
                      d="m8.39079 2.80235c.53842-1.51424 2.67991-1.51424 3.21831-.00001.3392.95358 1.4284 1.40477 2.3425.97027 1.4514-.68995 2.9657.82427 2.2758 2.27575-.4345.91407.0166 2.00334.9702 2.34248 1.5143.53842 1.5143 2.67996 0 3.21836-.9536.3391-1.4047 1.4284-.9702 2.3425.6899 1.4514-.8244 2.9656-2.2758 2.2757-.9141-.4345-2.0033.0167-2.3425.9703-.5384 1.5142-2.67989 1.5142-3.21831 0-.33914-.9536-1.4284-1.4048-2.34247-.9703-1.45148.6899-2.96571-.8243-2.27575-2.2757.43449-.9141-.01669-2.0034-.97028-2.3425-1.51422-.5384-1.51422-2.67994.00001-3.21836.95358-.33914 1.40476-1.42841.97027-2.34248-.68996-1.45148.82427-2.9657 2.27575-2.27575.91407.4345 2.00333-.01669 2.34247-.97026z"
                      clip-rule="evenodd"
                    ></path>
                  </g>
                </svg>
              </button> */}

              <div className="button" id="img-perfil">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#ffffffff"
                >
                  <path d="M480-492.31q-57.75 0-98.87-41.12Q340-574.56 340-632.31q0-57.75 41.13-98.87 41.12-41.13 98.87-41.13 57.75 0 98.87 41.13Q620-690.06 620-632.31q0 57.75-41.13 98.88-41.12 41.12-98.87 41.12ZM180-187.69v-88.93q0-29.38 15.96-54.42 15.96-25.04 42.66-38.5 59.3-29.07 119.65-43.61 60.35-14.54 121.73-14.54t121.73 14.54q60.35 14.54 119.65 43.61 26.7 13.46 42.66 38.5Q780-306 780-276.62v88.93H180Zm60-60h480v-28.93q0-12.15-7.04-22.5-7.04-10.34-19.11-16.88-51.7-25.46-105.42-38.58Q534.7-367.69 480-367.69q-54.7 0-108.43 13.11-53.72 13.12-105.42 38.58-12.07 6.54-19.11 16.88-7.04 10.35-7.04 22.5v28.93Zm240-304.62q33 0 56.5-23.5t23.5-56.5q0-33-23.5-56.5t-56.5-23.5q-33 0-56.5 23.5t-23.5 56.5q0 33 23.5 56.5t56.5 23.5Zm0-80Zm0 384.62Z" />
                </svg>
              </div>
            </div>

            <div className="svg-container">
              <svg viewBox="0 0 202.9 45.5">
                <clipPath
                  id="menu"
                  clipPathUnits="objectBoundingBox"
                  transform="scale(0.0049285362247413 0.021978021978022)"
                  >
                  <path
                    d="M6.7,0.0c5.7-0.1,14.1,0.4,23.3,4c5.7,2.3,9.9,5,18.1,10.5c10.7,7.1,11.8,9.2,20.6,14.3c5,2.9,9.2,5.2,15.2,7
                      c7.1,2.1,13.3,2.3,17.6,2.1c4.2,0.2,10.5-0.1,17.6-2.1c6.1-1.8,10.2-4.1,15.2-7c8.8-5,9.9-7.1,20.6-14.3c8.3-5.5,12.4-8.2,18.1-10.5
                      c9.2-3.6,17.6-4.2,23.3-4H6.7z"
                  />
                </clipPath>
              </svg>
            </div>
          </div>
        </menu>
      </div>
    </>
  );
}
