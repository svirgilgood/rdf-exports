import "./App.css";

import React, { useEffect, useState } from "react";

import { Deck, DefaultTemplate, MarkdownSlideSet } from "spectacle";

//import raw from "data/ConstraintsFroLinkedOpenData.md";
import raw from "./data/ConstraintsForLinkedOpenData.md";

function App() {
  const [md, setMd] = useState("");
  useEffect(() => {
    fetch(raw)
      .then((r) => r.text())
      .then((text) => setMd(text));
    console.log(typeof md);
  }, []);
  if (md === "") {
    return <div>Building</div>;
  }
  return (
    <Deck template={<DefaultTemplate />}>
      <MarkdownSlideSet>{md}</MarkdownSlideSet>
    </Deck>
  );
}

export default App;

/*
      <Slide>
        <Heading>Welcome to Spectacle</Heading>
      </Slide>
      <Slide>
        <Heading>This is a test</Heading>
        <ul>
          <li>One</li>
          <li>Two</li>
        </ul>
      </Slide>
      {md != "" &&
        md.split("\n#").map((slideText) => {
          console.log(slideText);
          return (
            <Slide>
              <Markdown>{slideText}</Markdown>
            </Slide>
          );
        })}

         {md != "" &&
        md
          .split("\n#")
          .filter((txt) => txt != "")
        .map((slideText) => {
          console.log(slideText);
          return <MarkdownSlide animateListItems> {slideText}</MarkdownSlide>;
        })}
  */
