import React, { useState } from "react"
import styles from "./Home.module.css"
// import child from "./image/child.svg"
// import ball from "./image/ball.svg"

function Home() {
  const [count, setCount] = useState(0)
  return (
    <React.Fragment>
      <div className={`${styles.top}`}>
        <div className={`row`}>
          <div className={`col-md-6 ${styles.leftcolumnone}`}>Hello</div>
          <div className={`col-md-6 ${styles.rightcolumnone}`}>
            <div className={`row ${styles.rowone} align-items-center `}>
              <div className={`col text-center`}>
                <div className={`${styles.samikhiumtitle}`}>Samikhium</div>
                <div className={`${styles.samikhiumtext}`}>
                  Decentralized Blogging and Video Sharing
                </div>
              </div>
            </div>
            <div className={`row ${styles.rowtwo} align-items-center`}>
              <div className={`col ${styles.samikhiumdescription}`}>
                <h3>
                  A decentralized blogging and video sharing platform without
                  information pollution
                </h3>
                Samikhium is a blogging and video app, build on coordination
                games to separate fake, misleading, and redundant information
                from quality content. It incentivizes only quality original
                content as per the scientific guidelines, not low-quality
                redundant information that causes information overload.
                Samikhium does not incentivize based on page views, or likes,
                dislikes, which can be easily hacked by producing clickbait
                titles, for paying for likes, dislikes, or more page views.
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Home
