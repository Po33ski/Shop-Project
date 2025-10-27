import style from "./Hero.module.css";
import { CenteredContent } from "../CenteredContent/CenteredContent";
import { FullWidthButton } from "../FullWidthButton/FullWidthButton";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export function Hero({ heroImage }) {
  const params = useParams();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (heroImage) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(heroImage);
        setImageLoaded(true);
      };
      img.src = heroImage;
    }
  }, [heroImage]);

  return (
    <div
      className={style.hero}
      style={{ 
        backgroundImage: imageLoaded ? `url(${imageSrc})` : 'none',
        backgroundColor: !imageLoaded ? '#f0f0f0' : 'transparent'
      }}
    >
      <CenteredContent>
        <div className={style.contentWrapper}>
          <h2>Letnie promocje do -70%!</h2>
          <p>Tylko najlepsze okazje!</p>
          <Link to={`/${params.gender}/odziez`}>
            <FullWidthButton>Sprawdź produkty</FullWidthButton>
          </Link>
        </div>
      </CenteredContent>
    </div>
  );
}
