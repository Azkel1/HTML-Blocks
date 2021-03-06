const icons = {
    // Fallback icon, used when the required icon is not found
    "fallback": <><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></>,

    // Normal icons
    "logIn": <><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/></>,
    "logOut": <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m5 5H9"/></>,
    "user": <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    "file": <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M12 18v-6M9 15h6"/></>,
    "x": <><path d="M18 6L6 18M6 6l12 12"/></>,

    // Icons for the canvas' blocks
    "block": {
        "div": <><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></>,
        "span": <><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></>,
        "img": <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></>,
        "a": <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></>,
        "h1": <><path d="M12.419 11.72H3.678m8.741-6.273v13.384M3.678 5.52v13.383"/><path d="M16.94 8.777l3.944-3.305m0 13.147V5.472" /></>,
        "h2": <><path d="M11.8 11.72H3.059M11.8 5.448v13.384M3.059 5.522v13.384"/><path d="M15.22 6.902s2.18-1.71 4.054-1.303c4.552.987 1.262 8.411-4.061 13.054-.067.057 6.545.046 6.545.046"/></>,
        "h3": <><path d="M11.8 11.72H3.059M11.8 5.448v13.384M3.059 5.522v13.384"/><path d="M15.671 5.68s5.3-.648 5.3 2.722c0 3.523-4.442 3.688-4.442 3.688m0 0s5.324-.26 5.324 3.89c0 3.484-6.222 2.83-6.222 2.83"/></>,
        "p": <><path d="M9.029 5.442s3.917-.758 5.526 1.735c.59.912.665 2.998-.53 3.886-1.498 1.113-4.996.792-4.996.792m0 6.97V5.443"/></>
    }
};

export default function Icon ({ icon, child }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            { (child) ? icons[icon][child] || icons["fallback"] : icons[icon] || icons["fallback"] }
        </svg>
    );
}