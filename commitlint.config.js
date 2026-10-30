const TRAILER = /^[A-Za-z][A-Za-z-]*: /
const CJK = /[⺀-鿿豈-﫿︰-﹏＀-｠￠-￦]/

const bodyLines = ({ raw }) =>
  (raw ?? "")
    .split("\n")
    .slice(1)
    .filter((line) => !line.startsWith("#") && !TRAILER.test(line))

const displayWidth = (line) =>
  [...line].reduce((width, char) => width + (CJK.test(char) ? 2 : 1), 0)

export default {
  extends: ["@commitlint/config-conventional"],
  plugins: [
    {
      rules: {
        "body-width": (parsed, _when, max) => {
          const line = bodyLines(parsed).find(
            (text) => displayWidth(text) > max,
          )
          return [!line, `body lines must fit ${max} columns: ${line}`]
        },
        "body-chinese": (parsed) => {
          const body = bodyLines(parsed).join("").trim()
          return [
            !body || CJK.test(body),
            "the body must be written in Chinese",
          ]
        },
        "no-co-author": ({ raw }) => [
          !/^co-authored-by:/im.test(raw ?? ""),
          "remove the Co-Authored-By trailer",
        ],
      },
    },
  ],
  rules: {
    "header-max-length": [2, "always", 50],
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
    "body-width": [2, "always", 72],
    "body-chinese": [2, "always"],
    "no-co-author": [2, "always"],
  },
}
