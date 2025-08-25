import React, { useState, useRef } from "react";
import { marked } from "marked";
import ReactMarkdown from "react-markdown";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import nlp from "compromise";
import "./App.css";

const database = {
  introductions: [
    "In the bustling halls of {setting}, {char1} first noticed {char2} during a heated argument.",
    "Under the starry skies of {setting}, {char1} stumbled upon {char2} in a moment of vulnerability.",
    "Amid the chaos of {setting}, {char1} and {char2} were forced to team up against a common foe.",
  ],
  conflicts: [
    "Their initial disdain turned into unspoken tension as secrets from the past resurfaced.",
    "Jealousy sparked when a third party entered the picture, testing their budding feelings.",
    "A misunderstanding led to a dramatic confrontation, revealing hidden desires.",
  ],
  climaxes: [
    "In a passionate embrace, they confessed their love, bridging the gap of {trope}.",
    "Overcoming obstacles, they shared a tender kiss, solidifying their bond.",
    "With hearts racing, they surrendered to their emotions in a whirlwind of intimacy.",
  ],
  endings: [
    "And so, in {setting}, their story became one of eternal love and adventure.",
    "Hand in hand, they faced the future, forever changed by their {trope} journey.",
    "Their love story inspired many, proving that true connections transcend all barriers.",
  ],
  dialogues: [
    '"I never thought I\'d feel this way about you," {char1} whispered.',
    '"You drive me crazy, but I can\'t stay away," {char2} admitted with a blush.',
    '"Let\'s make this real," they said in unison, hearts aligned.',
  ],
};

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function App() {
  const [archetype1, setArchetype1] = useState("tsundere");
  const [archetype2, setArchetype2] = useState("soft boy");
  const [setting, setSetting] = useState("high school");
  const [trope, setTrope] = useState("enemies-to-lovers");
  const [story, setStory] = useState("");
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [tweakedStory, setTweakedStory] = useState("");
  const [customThoughts, setCustomThoughts] = useState("");
  const [targetSection, setTargetSection] = useState("introduction");
  const storyRef = useRef(null);

  const generateStory = () => {
    const char1 = `the ${archetype1}`;
    const char2 = `the ${archetype2}`;

    let newStory = `# ${archetype1.charAt(0).toUpperCase() + archetype1.slice(1)} x ${archetype2.charAt(0).toUpperCase() + archetype2.slice(1)} in ${setting.charAt(0).toUpperCase() + setting.slice(1)}\n\n`;

    let intro = getRandom(database.introductions)
      .replace("{setting}", setting)
      .replace("{char1}", char1)
      .replace("{char2}", char2);
    let conflict = getRandom(database.conflicts).replace("{trope}", trope);
    let climax = getRandom(database.climaxes).replace("{trope}", trope);
    let ending = getRandom(database.endings)
      .replace("{setting}", setting)
      .replace("{trope}", trope);

    let dialogue1 = getRandom(database.dialogues)
      .replace("{char1}", char1)
      .replace("{char2}", char2);
    let dialogue2 = getRandom(database.dialogues)
      .replace("{char1}", char1)
      .replace("{char2}", char2);

    newStory += `**Introduction:** ${intro}\n\n`;
    newStory += `${dialogue1}\n\n`;
    newStory += `**Conflict:** ${conflict}\n\n`;
    newStory += `${dialogue2}\n\n`;
    newStory += `**Climax:** ${climax}\n\n`;
    newStory += `**Ending:** ${ending}`;

    setStory(newStory);
    setTweakedStory(newStory);
  };

  const applyTweaks = () => {
    setStory(tweakedStory);
    setInteractiveMode(false);
  };

  const incorporateThoughts = () => {
    if (!customThoughts.trim()) return;

    const doc = nlp(customThoughts);
    const verbs = doc.verbs().out("array");
    const nouns = doc.nouns().out("array");
    const adjectives = doc.adjectives().out("array");

    const shouldReplace = verbs.some((v) =>
      ["replace", "change", "overwrite"].includes(v.toLowerCase()),
    );
    const hasAdd = verbs.some((v) => v.toLowerCase() === "add");
    const char1 = `the ${archetype1}`;
    const char2 = `the ${archetype2}`;
    let newSection = "";

    // Dynamic keyword detection using extracted nouns and adjectives
    const hasBeach = nouns.some((n) => n.toLowerCase().includes("beach"));
    const hasDate = nouns.some((n) => n.toLowerCase().includes("date"));
    const hasArgue = nouns.some(
      (n) =>
        n.toLowerCase().includes("argu") || n.toLowerCase().includes("fight"),
    );
    const hasRomantic =
      adjectives.some((a) => a.toLowerCase().includes("romantic")) ||
      nouns.some(
        (n) =>
          n.toLowerCase().includes("kiss") ||
          n.toLowerCase().includes("romance"),
      );

    // Generate new content based on target section and parsed input
    if (targetSection === "introduction") {
      if (hasBeach || hasDate) {
        newSection =
          shouldReplace || !hasAdd
            ? `On a serene beach in ${setting}, ${char1} and ${char2} shared a quiet moment that sparked their connection.`
            : ` Their beachside encounter deepened their initial spark.`;
      } else if (hasArgue) {
        newSection =
          shouldReplace || !hasAdd
            ? `In the heart of ${setting}, a fiery argument between ${char1} and ${char2} set the stage for their story.`
            : ` A sudden argument in ${setting} added tension to their meeting.`;
      } else if (hasRomantic) {
        newSection =
          shouldReplace || !hasAdd
            ? `In a romantic corner of ${setting}, ${char1} and ${char2} found themselves drawn together unexpectedly.`
            : ` A romantic moment in ${setting} brought them closer.`;
      } else {
        newSection =
          shouldReplace || !hasAdd
            ? `In a fleeting moment in ${setting}, ${char1} and ${char2} crossed paths, igniting a spark of ${trope}.`
            : ` A subtle connection in ${setting} began to form between them.`;
      }
    } else if (targetSection === "conflict") {
      if (hasBeach || hasDate) {
        newSection =
          shouldReplace || !hasAdd
            ? `A romantic outing in ${setting} led to unexpected tension between ${char1} and ${char2}, testing their bond.`
            : ` Their date in ${setting} stirred unexpected friction.`;
      } else if (hasArgue) {
        newSection =
          shouldReplace || !hasAdd
            ? `A fierce dispute in ${setting} pushed ${char1} and ${char2} to confront their deepest insecurities.`
            : ` Another argument in ${setting} heightened their conflict.`;
      } else if (hasRomantic) {
        newSection =
          shouldReplace || !hasAdd
            ? `A moment of closeness in ${setting} stirred conflicting emotions for ${char1} and ${char2}.`
            : ` A near-kiss in ${setting} complicated their emotions.`;
      } else {
        newSection =
          shouldReplace || !hasAdd
            ? getRandom(database.conflicts).replace("{trope}", trope)
            : ` A new challenge in their ${trope} dynamic emerged.`;
      }
    } else if (targetSection === "climax") {
      if (hasBeach || hasDate) {
        newSection =
          shouldReplace || !hasAdd
            ? `On a moonlit beach in ${setting}, ${char1} and ${char2} surrendered to their feelings, sealing their bond.`
            : ` A beachside confession intensified their connection.`;
      } else if (hasArgue) {
        newSection =
          shouldReplace || !hasAdd
            ? `After a heated clash in ${setting}, ${char1} and ${char2} reconciled with a passionate embrace.`
            : ` A resolution to their fight in ${setting} brought them closer.`;
      } else if (hasRomantic) {
        newSection =
          shouldReplace || !hasAdd
            ? `In a tender moment in ${setting}, ${char1} and ${char2} shared a kiss that changed everything.`
            : ` A kiss in ${setting} marked a turning point.`;
      } else {
        newSection =
          shouldReplace || !hasAdd
            ? getRandom(database.climaxes).replace("{trope}", trope)
            : ` Their bond deepened through a pivotal moment.`;
      }
    } else if (targetSection === "ending") {
      if (hasBeach || hasDate) {
        newSection =
          shouldReplace || !hasAdd
            ? `On the shores of ${setting}, ${char1} and ${char2} vowed to cherish their love forever.`
            : ` A final beachside moment sealed their commitment.`;
      } else if (hasArgue) {
        newSection =
          shouldReplace || !hasAdd
            ? `Having overcome their conflicts in ${setting}, ${char1} and ${char2} embraced a future together.`
            : ` Their resolved conflicts paved the way for a hopeful future.`;
      } else if (hasRomantic) {
        newSection =
          shouldReplace || !hasAdd
            ? `In the heart of ${setting}, ${char1} and ${char2} sealed their love with a promise to never part.`
            : ` A final romantic gesture ensured their love endured.`;
      } else {
        newSection =
          shouldReplace || !hasAdd
            ? getRandom(database.endings)
                .replace("{setting}", setting)
                .replace("{trope}", trope)
            : ` Their journey in ${setting} concluded with newfound unity.`;
      }
    }

    // Parse the tweaked story and update the target section
    let sections = tweakedStory.split("\n\n").filter((s) => s.trim());
    let newTweakedStory = "";
    const char1Name = `the ${archetype1}`;
    const char2Name = `the ${archetype2}`;
    let dialogue1 = getRandom(database.dialogues)
      .replace("{char1}", char1Name)
      .replace("{char2}", char2Name);
    let dialogue2 = getRandom(database.dialogues)
      .replace("{char1}", char1Name)
      .replace("{char2}", char2Name);

    if (targetSection === "introduction") {
      const currentIntro = sections[1].startsWith("**Introduction:**")
        ? sections[1].replace("**Introduction:** ", "")
        : sections[1] || "";
      const updatedIntro = shouldReplace
        ? newSection
        : `${currentIntro} ${newSection}`;
      newTweakedStory = `${sections[0] || ""}\n\n**Introduction:** ${updatedIntro}\n\n${dialogue1}\n\n${sections.slice(2).join("\n\n")}`;
    } else if (targetSection === "conflict") {
      const currentConflict = sections[3].startsWith("**Conflict:**")
        ? sections[3].replace("**Conflict:** ", "")
        : sections[3] || "";
      const updatedConflict = shouldReplace
        ? newSection
        : `${currentConflict} ${newSection}`;
      newTweakedStory = `${sections.slice(0, 3).join("\n\n")}\n\n**Conflict:** ${updatedConflict}\n\n${dialogue2}\n\n${sections.slice(4).join("\n\n")}`;
    } else if (targetSection === "climax") {
      const currentClimax = sections[5].startsWith("**Climax:**")
        ? sections[5].replace("**Climax:** ", "")
        : sections[5] || "";
      const updatedClimax = shouldReplace
        ? newSection
        : `${currentClimax} ${newSection}`;
      newTweakedStory = `${sections.slice(0, 5).join("\n\n")}\n\n**Climax:** ${updatedClimax}\n\n${sections.slice(6).join("\n\n")}`;
    } else if (targetSection === "ending") {
      const currentEnding = sections[6].startsWith("**Ending:**")
        ? sections[6].replace("**Ending:** ", "")
        : sections[6] || "";
      const updatedEnding = shouldReplace
        ? newSection
        : `${currentEnding} ${newSection}`;
      newTweakedStory = `${sections.slice(0, 6).join("\n\n")}\n\n**Ending:** ${updatedEnding}`;
    }

    setTweakedStory(newTweakedStory);
    setCustomThoughts("");
  };

  const exportAsText = () => {
    const blob = new Blob([story], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "yaoi-story.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsPDF = () => {
    const element = document.getElementById("story-output");
    html2pdf().from(element).save("yaoi-story.pdf");
  };

  const exportAsScreenshot = () => {
    const element = storyRef.current;
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = imgData;
      a.download = "yaoi-story.png";
      a.click();
    });
  };

  const shareAsScreenshot = () => {
    const element = storyRef.current;
    html2canvas(element).then((canvas) => {
      canvas.toBlob((blob) => {
        const shareData = {
          files: [new File([blob], "yaoi-story.png", { type: "image/png" })],
          title: "My Yaoi Story",
          text: "Check out my generated yaoi story!",
        };
        if (navigator.share && navigator.canShare(shareData)) {
          navigator
            .share(shareData)
            .catch((err) => console.error("Share failed:", err));
        } else {
          alert("Web Share API not supported. Downloading instead.");
          exportAsScreenshot();
        }
      });
    });
  };

  return (
    <div className="App">
      <h1>Yaoi Story Generator</h1>
      <p>
        Select options to generate a customizable yaoi story prompt or short
        story.
      </p>

      <label>Character 1 Archetype:</label>
      <select
        value={archetype1}
        onChange={(e) => setArchetype1(e.target.value)}
      >
        <option value="tsundere">Tsundere</option>
        <option value="soft boy">Soft Boy</option>
        <option value="alpha male">Alpha Male</option>
        <option value="mysterious stranger">Mysterious Stranger</option>
        <option value="playful tease">Playful Tease</option>
      </select>

      <label>Character 2 Archetype:</label>
      <select
        value={archetype2}
        onChange={(e) => setArchetype2(e.target.value)}
      >
        <option value="tsundere">Tsundere</option>
        <option value="soft boy">Soft Boy</option>
        <option value="alpha male">Alpha Male</option>
        <option value="mysterious stranger">Mysterious Stranger</option>
        <option value="playful tease">Playful Tease</option>
      </select>

      <label>Setting:</label>
      <select value={setting} onChange={(e) => setSetting(e.target.value)}>
        <option value="high school">High School</option>
        <option value="fantasy kingdom">Fantasy Kingdom</option>
        <option value="modern city">Modern City</option>
        <option value="space station">Space Station</option>
        <option value="historical era">Historical Era</option>
      </select>

      <label>Trope:</label>
      <select value={trope} onChange={(e) => setTrope(e.target.value)}>
        <option value="enemies-to-lovers">Enemies-to-Lovers</option>
        <option value="friends-to-lovers">Friends-to-Lovers</option>
        <option value="forbidden love">Forbidden Love</option>
        <option value="second chance">Second Chance</option>
        <option value="fake relationship">Fake Relationship</option>
      </select>

      <button onClick={generateStory}>Generate Story</button>
      <button onClick={() => setInteractiveMode(true)}>
        Enter Interactive Mode
      </button>
      <button onClick={exportAsPDF}>Export as PDF</button>
      <button onClick={exportAsText}>Export as Text</button>
      <button onClick={exportAsScreenshot}>Export as Screenshot</button>
      <button onClick={shareAsScreenshot}>Share as Screenshot</button>

      <div id="story-output" ref={storyRef}>
        <ReactMarkdown>{story}</ReactMarkdown>
      </div>

      {interactiveMode && (
        <div id="interactive-section">
          <h2>Interactive Mode</h2>
          <p>
            Tweak the generated story by editing plot points or dialogue below.
          </p>
          <textarea
            rows="10"
            cols="80"
            value={tweakedStory}
            onChange={(e) => setTweakedStory(e.target.value)}
          />
          <h3>Add Your Thoughts/Ideas</h3>
          <p>
            Enter your thoughts to inspire a custom story section (e.g., 'Add a
            romantic beach scene' or 'Replace conflict with a betrayal'). Use
            'replace' or 'change' to overwrite the section.
          </p>
          <label>Target Section:</label>
          <select
            value={targetSection}
            onChange={(e) => setTargetSection(e.target.value)}
          >
            <option value="introduction">Introduction</option>
            <option value="conflict">Conflict</option>
            <option value="climax">Climax</option>
            <option value="ending">Ending</option>
          </select>
          <textarea
            rows="5"
            cols="80"
            value={customThoughts}
            onChange={(e) => setCustomThoughts(e.target.value)}
            placeholder="E.g., 'Add a romantic beach scene' or 'Replace conflict with a betrayal'"
          />
          <button onClick={incorporateThoughts}>Incorporate Thoughts</button>
          <button onClick={applyTweaks}>Apply All Tweaks</button>
        </div>
      )}
    </div>
  );
}

export default App;
