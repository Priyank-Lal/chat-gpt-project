import { r as l, u as N, a as v, j as e, b as j } from "./index-bKkJqefr.js";
import { m as s, L as r, I as i, B as p } from "./createLucideIcon-CDq7stiw.js";
import { u as w, E as k, a as C, C as L } from "./index.esm-B6Uqf7j3.js";
const R = () => {
  const { register: t, handleSubmit: g, reset: E } = w(),
    [n, o] = l.useState(""),
    [c, d] = l.useState(!1),
    [x, m] = l.useState(!1),
    u = N(),
    f = v(),
    b = async (y) => {
      d(!0),
        o(""),
        (await f(j(y)))?.success
          ? u("/")
          : o("Registration failed. Please check your details and try again."),
        d(!1);
    },
    h = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.6, staggerChildren: 0.1 },
      },
    },
    a = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };
  return e.jsxs("div", {
    className: "min-h-screen flex bg-[#1a1a1a]",
    children: [
      e.jsx(s.div, {
        className: "flex-1 flex items-center justify-center p-10",
        initial: "hidden",
        animate: "visible",
        variants: h,
        children: e.jsxs("div", {
          className:
            "w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-8",
          children: [
            e.jsxs(s.div, {
              variants: a,
              className: "flex items-center space-x-2",
              children: [
                e.jsx("img", {
                  src: "/icons8-ai.svg",
                  alt: "Nebula Logo",
                  className: "w-8 h-8",
                }),
                e.jsx("span", {
                  className: "text-2xl font-bold text-white",
                  children: "Nebula",
                }),
              ],
            }),
            e.jsxs(s.div, {
              variants: a,
              className: "space-y-2",
              children: [
                e.jsx("h1", {
                  className: "text-gray-300 text-4xl font-extrabold",
                  children: "Register",
                }),
                e.jsx("p", {
                  className: "text-gray-300",
                  children: "Welcome to Nebula! Please enter your details.",
                }),
              ],
            }),
            n &&
              e.jsxs(s.div, {
                initial: { opacity: 0, y: -10 },
                animate: { opacity: 1, y: 0 },
                className:
                  "bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded flex items-center gap-2",
                children: [
                  e.jsx("svg", {
                    className: "w-5 h-5 flex-shrink-0",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    viewBox: "0 0 24 24",
                    xmlns: "http://www.w3.org/2000/svg",
                    "aria-hidden": "true",
                    children: e.jsx("path", {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      d: "M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728",
                    }),
                  }),
                  e.jsx("span", { children: n }),
                ],
              }),
            e.jsxs(s.form, {
              onSubmit: g(b),
              variants: h,
              className: "space-y-6",
              children: [
                e.jsxs(s.div, {
                  variants: a,
                  className: "space-x-4 flex",
                  children: [
                    e.jsxs("div", {
                      className: "flex flex-col space-y-2 w-1/2",
                      children: [
                        e.jsxs(r, {
                          htmlFor: "firstName",
                          className: "text-sm font-medium text-gray-300",
                          children: [
                            "First Name ",
                            e.jsx("span", {
                              className: "text-red-500",
                              children: "*",
                            }),
                          ],
                        }),
                        e.jsx("div", {
                          className: "relative",
                          children: e.jsx(i, {
                            id: "firstName",
                            type: "text",
                            placeholder: "",
                            ...t("firstName"),
                            className:
                              "h-12 rounded-xl shadow-sm border-gray-700 bg-[#2a2a2a] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-3 text-white",
                          }),
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "flex flex-col space-y-2 w-1/2",
                      children: [
                        e.jsxs(r, {
                          htmlFor: "lastName",
                          className: "text-sm font-medium text-gray-300",
                          children: [
                            "Last Name ",
                            e.jsx("span", {
                              className: "text-red-500",
                              children: "*",
                            }),
                          ],
                        }),
                        e.jsx("div", {
                          className: "relative",
                          children: e.jsx(i, {
                            id: "lastName",
                            type: "text",
                            placeholder: "",
                            ...t("lastName"),
                            className:
                              "h-12 rounded-xl shadow-sm border-gray-700 bg-[#2a2a2a] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-3 text-white",
                          }),
                        }),
                      ],
                    }),
                  ],
                }),
                e.jsxs(s.div, {
                  variants: a,
                  className: "space-y-2",
                  children: [
                    e.jsxs(r, {
                      htmlFor: "email",
                      className: "text-sm font-medium text-gray-300",
                      children: [
                        "Email ",
                        e.jsx("span", {
                          className: "text-red-500",
                          children: "*",
                        }),
                      ],
                    }),
                    e.jsx("div", {
                      className: "relative",
                      children: e.jsx(i, {
                        id: "email",
                        type: "email",
                        placeholder: "olivia@untitledui.com",
                        ...t("email"),
                        className:
                          "h-12 rounded-xl shadow-sm border-gray-700 bg-[#2a2a2a] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-3 text-white",
                      }),
                    }),
                  ],
                }),
                e.jsxs(s.div, {
                  variants: a,
                  className: "space-y-2",
                  children: [
                    e.jsxs(r, {
                      htmlFor: "password",
                      className: "text-sm font-medium text-gray-300",
                      children: [
                        "Password ",
                        e.jsx("span", {
                          className: "text-red-500",
                          children: "*",
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "relative",
                      children: [
                        e.jsx(i, {
                          id: "password",
                          type: x ? "text" : "password",
                          placeholder: "",
                          autoComplete: "password",
                          ...t("password"),
                          className:
                            "h-12 rounded-xl shadow-sm border-gray-700 bg-[#2a2a2a] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-3 text-white",
                        }),
                        e.jsx("div", {
                          className:
                            "absolute inset-y-0 right-3 flex items-center text-blue-400",
                          children: x
                            ? e.jsx(e.Fragment, {
                                children: e.jsx(k, {
                                  size: 20,
                                  className: "cursor-pointer text-gray-400",
                                  onClick: () => m(!1),
                                }),
                              })
                            : e.jsx(e.Fragment, {
                                children: e.jsx(C, {
                                  size: 20,
                                  className: "cursor-pointer text-gray-400",
                                  onClick: () => m(!0),
                                }),
                              }),
                        }),
                      ],
                    }),
                  ],
                }),
                e.jsxs(s.div, {
                  variants: a,
                  className: "space-y-4",
                  children: [
                    e.jsx(p, {
                      type: "submit",
                      disabled: c,
                      className:
                        "w-full h-12 hover:bg-blue-600 bg-blue-500 hover:scale-102 hover:shadow-lg text-white font-medium rounded-xl transition-transform cursor-pointer",
                      children: c ? "Creating account..." : "Create account",
                    }),
                    e.jsxs(p, {
                      type: "button",
                      variant: "outline",
                      className:
                        "w-full h-12 bg-white hover:bg-gray-100 shadow-md hover:scale-102 hover:shadow-lg font-medium rounded-xl flex items-center justify-center space-x-2 cursor-pointer text-gray-700",
                      children: [
                        e.jsx(L, { className: "w-5 h-5" }),
                        e.jsx("span", { children: "Sign in with Google" }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            e.jsx(s.div, {
              variants: a,
              className: "text-center pt-4",
              children: e.jsxs("p", {
                className: "text-sm text-gray-300",
                children: [
                  "Already have an account?",
                  " ",
                  e.jsx("button", {
                    onClick: () => u("/login"),
                    className:
                      "text-blue-300 hover:text-blue-400 font-medium cursor-pointer",
                    children: "Log In",
                  }),
                ],
              }),
            }),
          ],
        }),
      }),
      e.jsxs(s.div, {
        className:
          "flex-1 p-10 flex flex-col justify-center items-center relative overflow-hidden",
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.8, delay: 0.2 },
        children: [
          e.jsx("div", {
            className:
              "absolute top-10 left-10 w-40 h-40 bg-blue-500/10 rounded-full filter blur-3xl pointer-events-none",
          }),
          e.jsx("div", {
            className:
              "absolute bottom-20 right-20 w-56 h-56 bg-purple-500/10 rounded-full filter blur-3xl pointer-events-none",
          }),
          e.jsx("div", {
            className:
              "absolute top-1/2 left-1/2 w-72 h-72 bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2",
          }),
          e.jsx("div", {
            className: "max-w-lg text-center space-y-8 z-10 w-full",
            children: e.jsxs(s.div, {
              initial: { opacity: 0, y: 30 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6, delay: 0.3 },
              className: "space-y-4 px-4",
              children: [
                e.jsx("h2", {
                  className: "text-5xl font-extrabold text-blue-400",
                  children: "Welcome to Nebula",
                }),
                e.jsx("p", {
                  className: "text-gray-300 text-lg leading-relaxed",
                  children:
                    "Harness the power of advanced analytics and insights. Streamline your workflow, enhance productivity, and create exceptional experiences for your users.",
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
};
export { R as default };
