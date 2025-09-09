// src/components/Snake.tsx
import { useState, type Dispatch } from "react";

interface SnakeProps {
  letters: string[];
  word: string;
  lettersVisible: boolean;
  setLettersVisible: Dispatch<React.SetStateAction<boolean>>;
}

export default function Snake({
  letters,
  word,
  lettersVisible,
  setLettersVisible,
}: SnakeProps) {
  const NUMSECTIONS = 20;

  const anglePerSection = 360 / NUMSECTIONS;
  const headSections = letters.length > 0 ? -(letters.length - 1) : 0;
  const headRotation = headSections * anglePerSection;

  const svgSize = 450;
  const bodyWidth = 371;
  const bodyHeight = 368;

  const offsetX = (svgSize - bodyWidth) / 2;
  const offsetY = (svgSize - bodyHeight) / 2;

  const centerX = svgSize / 2; // rotation center
  const centerY = svgSize / 2;
  const radius = 150; // distance from center to snake circle

  function padAndShiftLetters(letters: string[], NUMSECTIONS = 20): string[] {
    const result: string[] = new Array(NUMSECTIONS).fill("");

    const len = letters.length;

    if (len >= NUMSECTIONS) {
      // Take the last NUMSECTIONS letters
      const lastLetters = letters.slice(len - NUMSECTIONS);
      const lastIndex = 1; // last letter goes to index 1
      for (let i = 0; i < NUMSECTIONS; i++) {
        // Map so that last letter ends up at lastIndex, wrapping backwards
        const idx =
          (lastIndex - (NUMSECTIONS - 1 - i) + NUMSECTIONS) % NUMSECTIONS;
        result[idx] = lastLetters[i];
      }
    } else {
      // Pad shorter array
      const lastIndex = 1; // last letter goes to index 1
      for (let i = 0; i < len; i++) {
        const letter = letters[len - 1 - i]; // reverse order
        const idx = (lastIndex - i + NUMSECTIONS) % NUMSECTIONS; // wrap around
        result[idx] = letter;
      }
      // Fill remaining empty slots with indices as placeholders
      for (let i = 0; i < NUMSECTIONS; i++) {
        if (!result[i]) result[i] = "";
      }
    }

    return result;
  }

  const shiftedLetters = padAndShiftLetters(letters, NUMSECTIONS);

  return (
    <div>
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
      >
        <g transform={`translate(${offsetX}, ${offsetY})`}>
          {/* Body */}

          <g id="bodyGroup">
            {/* Copy your 20 paths from snake-body.svg here as <path> or <g> */}
            <svg
              width="371"
              height="368"
              viewBox="0 0 371 368"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M185 3.11006V57.47C169.439 57.4497 160.685 58.3161 145 62L128 9.15006C150.348 3.71841 162.823 2.60336 185 3.11006Z"
                fill="#71C877"
                stroke="#008616"
                strokeWidth="5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M128.874 9L146 61.5C131.039 66.7326 123.31 70.773 110.741 80L78 35C97.0199 22.642 108.078 16.7394 128.874 9Z"
                fill="#71C877"
                stroke="#008616"
                strokeWidth="5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M77.4985 35.278L110.382 79.9984C98.2403 88.7132 92.2619 94.8792 83.1227 108.233L37.8494 76.4757C51.3061 58.3763 60.2029 49.5698 77.4985 35.278Z"
                fill="#71C877"
              />
              <path
                d="M37.8494 76.4757L83.1227 108.233C92.2619 94.8792 98.2403 88.7132 110.382 79.9984L77.4985 35.278C60.2029 49.5698 51.3061 58.3763 37.8494 76.4757ZM37.8494 76.4757L37.3464 76.1229"
                stroke="#008616"
                strokeWidth="5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M38 76.3571L83 108.5C73.0063 121.354 69.5189 129.281 65 144L12 126.5C20.4774 105.866 25.7891 94.6475 38 76.3571Z"
                fill="#71C877"
              />
              <path
                d="M38 76.3571L83 108.5C73.0063 121.354 69.5189 129.281 65 144L12 126.5C20.4774 105.866 25.7891 94.6475 38 76.3571ZM38 76.3571L37.5 76"
                stroke="#008616"
                strokeWidth="5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 126L65 143.345C59.4486 158.173 58.6612 166.669 59.5 182H3C4.35191 159.402 5.87051 146.989 12 126Z"
                fill="#71C877"
                stroke="#008616"
                strokeWidth="5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M66 222L12.072 239C6.17935 217.177 4.36798 204.912 3 183H59.952C60.4178 198.147 61.9713 206.696 66 222Z"
                fill="#71C877"
                stroke="#008616"
                strokeWidth="5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M65.8741 222C71.8711 236.489 75.9175 244.093 84 257L38.1818 289C25.273 271.08 19.8438 259.951 12 239L65.8741 222Z"
                fill="#71C877"
                stroke="#008616"
                strokeWidth="5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M38 289L83.5 257C93.3522 268.825 99.3567 274.974 111 285L77.5 330C59.4277 314.727 51.213 305.629 38 289Z"
                fill="#71C877"
                stroke="#008616"
                strokeWidth="5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M77 330L110.745 285C123.96 293.079 131.631 297.205 146 303.5L128.372 356C107.322 348.535 96.1026 342.768 77 330Z"
                fill="#71C877"
                stroke="#008616"
                strokeWidth="5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M128 355.927L145.655 303C160.432 307.459 168.982 309.102 185 309.553V365C162.799 363.55 150.309 361.225 128 355.927Z"
                fill="#71C877"
                stroke="#008616"
                strokeWidth="5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M185 365V310C201.482 309.5 209.805 307.868 224 304L242 357C220.248 361.886 207.756 363.599 185 365Z"
                fill="#71C877"
                stroke="#008616"
                strokeWidth="5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M242.131 357L224 303.629C239.881 298.183 247.847 294.234 259.759 285L293 329.811C274.855 342.289 263.632 348.149 242.131 357Z"
                fill="#71C877"
                stroke="#008616"
                strokeWidth="5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M292 330L259 285.5C271.937 275.274 278.405 269.318 287.5 258L333 290.5C319.181 307.25 310.048 315.804 292 330Z"
                fill="#71C877"
                stroke="#008616"
                strokeWidth="5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M333.5 290L288 257.5C297.23 243.764 301.179 235.984 306.5 222L360 239.5C351.729 259.422 346.213 270.506 333.5 290Z"
                fill="#71C877"
                stroke="#008616"
                strokeWidth="5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M359.5 240L306 222.439C310.965 206.279 311.783 197.729 312 182.801H368C367.557 204.888 366.178 217.37 359.5 240Z"
                fill="#71C877"
              />
              <path
                d="M312 182.801C311.783 197.729 310.965 206.279 306 222.439L359.5 240C366.178 217.37 367.557 204.888 368 182.801H312ZM312 182.801C312.042 181.846 312.085 180.913 312.127 180"
                stroke="#008616"
                strokeWidth="5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M368 183H312C312.042 182.039 312.085 181.102 312.127 180.184C312.774 166.031 313.202 156.671 308 142.646L360 126C365.907 147.959 367.497 160.456 368 183Z"
                fill="#71C877"
                stroke="#008616"
                strokeWidth="5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M361 126.378L308.631 143C303.76 128.521 299.359 120.623 290 106.733L333.305 75C347.392 93.8163 353.637 104.997 361 126.378Z"
                fill="#71C877"
                stroke="#008616"
                strokeWidth="5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M333 75.2828L289.699 107C280.738 94.4433 273.741 88.653 261 79.3103L291.713 34C310.76 48.0979 319.917 57.0562 333 75.2828Z"
                fill="#71C877"
                stroke="#008616"
                strokeWidth="5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M292 34L261.274 79C249.168 70.3134 240.238 67.1874 227.436 62.7057L227.411 62.697C226.307 62.3104 225.166 61.9112 224 61.5L241.126 9C262.253 16.4918 273.447 21.8662 292 34Z"
                fill="#71C877"
                stroke="#008616"
                strokeWidth="5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M241 9.02958L224 61.7884C209.063 58.6179 200.539 57.5549 185 57.2662V3C207.922 3.14677 219.926 5.00585 241 9.02958Z"
                fill="#71C877"
              />
              <path
                d="M227.41 63C226.304 62.608 225.169 62.2056 224 61.7884M224 61.7884L241 9.02958C219.926 5.00585 207.922 3.14677 185 3V57.2662C200.539 57.5549 209.063 58.6179 224 61.7884Z"
                stroke="#008616"
                strokeWidth="5"
              />
            </svg>
          </g>

          {/* Letters */}
          <g
            id="lettersGroup"
            style={{
              opacity: lettersVisible ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          >
            {shiftedLetters.map((letter, i) => {
              const degreeOffset = 9; // 9 degrees clockwise
              const radOffset = (degreeOffset * Math.PI) / 180;
              const angle =
                (i / NUMSECTIONS) * 2 * Math.PI - Math.PI / 2 + radOffset; // -π/2 = top
              const x = centerX + radius * Math.cos(angle) - offsetX;
              const y = centerY + radius * Math.sin(angle) - offsetY;

              return (
                <text
                  key={i}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {letter}
                </text>
              );
            })}
          </g>

          {/* Head */}
          <g
            id="headGroup"
            style={{ transition: "transform 1s ease" }}
            transform={`rotate(${headRotation} ${centerX - 42} ${
              centerY - 45
            })`}
            onTransitionEnd={() => setLettersVisible(true)}
          >
            <svg
              width={128}
              height={92}
              viewBox="0 0 128 92"
              fill="none"
              x={centerX - 105}
              y={centerY - radius - 95}
            >
              <path
                d="M70 48V57L78 50.5L70 48Z"
                fill="#009419"
                fillOpacity="0.7"
              />
              <path
                d="M63.2424 3C41.7452 3.79988 12.0049 9.89722 7.58478 10.9525C3.16465 12.0077 0.169988 20.8315 7.15548 31.6579C22.9483 33.085 31.4408 34.9944 45.7595 40.9446C60.7329 46.2018 68.8679 48.1012 82.6196 48.434C72.479 54.993 68.1066 61.0542 55.5423 66.4202C55.5423 66.4202 31.5769 80.9958 29.0242 80.8107C26.4715 80.6255 34.0733 87.328 41.1674 88.8658C48.2616 90.4036 77.811 78.2394 82.6909 77.1363C87.5709 76.0331 103.3 80.1054 103.673 79.0514C104.046 77.9974 128.04 31.5523 124.677 28.9497C121.314 26.3471 112.59 21.8826 95.1844 11.6068C84.319 6.24824 77.7276 3.8639 63.2424 3Z"
                fill="#71C877"
                stroke="#008616"
                strokeWidth="5"
              />
              <path
                d="M44 19C51.6889 15.2778 55.8541 15.0551 63 18.1324"
                stroke="#002D07"
                strokeWidth="3"
              />
              <path
                d="M14.376 19.5078C14.9239 19.4392 15.4235 19.828 15.4922 20.376C15.5608 20.9239 15.172 21.4235 14.624 21.4922C14.0762 21.5606 13.5765 21.1719 13.5078 20.624C13.4394 20.0762 13.8281 19.5765 14.376 19.5078Z"
                fill="#002D07"
                stroke="#002D07"
              />
            </svg>
          </g>
        </g>
      </svg>
    </div>
  );
}
