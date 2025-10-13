import { useState } from "react";
import styles from "./ExpandableMenu.module.css";
import { CATEGORIES } from "../../constants/categories";
import { NavLink, useParams } from "react-router-dom";
import ARROW_ICON from "../../assets/arrow.svg";

const PATH_TO_GENDER_NAME = {
  kobieta: "Kobieta",
  mezczyzna: "Mężczyzna",
  dziecko: "Dziecko",
};

export function ExpandableMenu() {
  const params = useParams();
  const [expandedCategory, setExpandedCategory] = useState(params.category || null);

  const toggleCategory = (categoryPath) => {
    // On mobile, toggle - on desktop, just navigate
    if (window.innerWidth <= 768) {
      setExpandedCategory(expandedCategory === categoryPath ? null : categoryPath);
    }
  };

  return (
    <div className={styles.expandableMenu}>
      <p>{PATH_TO_GENDER_NAME[params.gender]}</p>
      <ul>
        {CATEGORIES.map((category) => {
          const isExpanded = expandedCategory === category.path;
          
          return (
            <li key={category.path}>
              <NavLink 
                to={`/${params.gender}/${category.path}`}
                onClick={(e) => {
                  // On mobile, prevent navigation if clicking to toggle
                  if (window.innerWidth <= 768 && params.category === category.path) {
                    e.preventDefault();
                    toggleCategory(category.path);
                  }
                }}
              >
                {category.categoryName}{" "}
                <img
                  src={ARROW_ICON}
                  className={isExpanded ? styles.expanded : ""}
                />
              </NavLink>
              {isExpanded && (
                <ul>
                  {category.subcategories.map((subcategory) => {
                    return (
                      <li key={subcategory.path}>
                        <NavLink
                          to={`/${params.gender}/${params.category}/${subcategory.path}`}
                          onClick={() => {
                            // Close menu after selecting subcategory on mobile
                            if (window.innerWidth <= 768) {
                              setExpandedCategory(null);
                            }
                          }}
                        >
                          {subcategory.categoryName}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
