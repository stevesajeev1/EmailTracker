// URL of server
const SERVER_URL = "";

// Load chrome extension on page load
window.addEventListener(
    "load",
    () => {
        console.log("Email Tracker Loaded");
        // Check every 100 ms to see if user is composing email
        setInterval(() => {
            handleMail();
        }, 100);
    },
    true
);

// Helper function to differentiate between Gmail and Outlook
const handleMail = () => {
    if (window.location.host === "mail.google.com") {
        // Handle Gmail
        handleGmail();
    } else {
        // Handle Outlook
        handleOutlook();
    }
};

const handleGmail = () => {
    // Get icon rows for all active composing tabs
    const iconRows = document.querySelectorAll("tr.btC");

    for (const iconRow of iconRows) {
        // Only inject if icon does not exist
        if (iconRow.querySelector(".track") == null) {
            // Inject icon
            const lastIcon = iconRow.querySelector("td.gU.a0z");

            const spyglassImage = chrome.runtime.getURL("spyglass.png");
            const trackIcon = `<td class="track gU aYL"><div class="J-J5-Ji bty"><div class="track-button oh J-Z-I J-J5-Ji T-I-ax7 T-I" role="button" data-tooltip="Track Email" style="user-select: none;"><img src="${spyglassImage}" style="width: 16px; height: 16px;"></div></div></td>`;

            lastIcon.insertAdjacentHTML("beforebegin", trackIcon);

            // Add listener to track click
            const trackButton = iconRow.querySelector(".track-button");
            trackButton.addEventListener(
                "click",
                function () {
                    const container = this.closest("div.aoI");
                    const trackPixel = container.querySelector(".track-pixel");
                    if (trackPixel) {
                        // Toggling to remove tracking
                        trackPixel.remove();
                        iconRow
                            .querySelector(".track-button")
                            .classList.toggle("J-Z-I-Jp");
                    } else {
                        // Toggling to add tracking
                        const emailBody =
                            container.querySelector("div.Am.Al.editable");

                        // Get subject
                        const subjectInput = container.querySelector(
                            "input[name='subjectbox']"
                        );
                        // Encode subject in image URL
                        const imageURL = `${SERVER_URL}${encodeURI(
                            subjectInput.value
                        )}`;
                        const imageTracker = `<img class="track-pixel" src="${imageURL}" style="display: none;">`;

                        // Inject image
                        emailBody.insertAdjacentHTML(
                            "afterbegin",
                            imageTracker
                        );

                        // Toggle color of button
                        iconRow
                            .querySelector(".track-button")
                            .classList.toggle("J-Z-I-Jp");

                        // Add listener to subject change
                        subjectInput.addEventListener(
                            "input",
                            (event) => {
                                const trackPixel =
                                    container.querySelector(".track-pixel");
                                if (trackPixel) {
                                    // Update URL with new subject
                                    const newImageURL = `${SERVER_URL}${encodeURI(
                                        event.target.value
                                    )}`;
                                    trackPixel.src = newImageURL;
                                }
                            },
                            true
                        );
                    }
                },
                true
            );
        }
    }
};

const handleOutlook = () => {
    // Inject CSS to add hover effect on button
    if (document.querySelector("#track-style") == null) {
        const style = document.createElement("style");
        style.id = "track-style";
        style.textContent = `
        #track-button:hover {
            cursor: pointer;
        }
        `;
        document.head.append(style);
    }

    // Get icon row
    const iconRow = document.querySelector("div.eU3xR");
    if (iconRow) {
        // Only inject if icon does not exist
        if (iconRow.querySelector("#track-button") == null) {
            // Inject icon
            const spyglassImage = chrome.runtime.getURL("spyglass.png");
            const trackIcon = `<button type="button" class="ms-Button ms-Button--default KVeIF KJpH4 IawJO fOeiY root-389" title="Track Email" id="track-button"><span class="ms-Button-flexContainer flexContainer-162" data-automationid="splitbuttonprimary"><img src="${spyglassImage}" style="width: 16px; height: 16px; filter: invert(100%);"></span></button>`;

            iconRow.insertAdjacentHTML("afterbegin", trackIcon);
            iconRow.style.alignItems = "center";

            // Add listener to track click
            const trackButton = iconRow.querySelector("#track-button");
            trackButton.addEventListener(
                "click",
                function () {
                    const trackPixel = document.querySelector("#track-pixel");
                    if (trackPixel) {
                        // Toggling to remove tracking
                        trackPixel.remove();
                        document.getElementById(
                            "track-button"
                        ).style.backgroundColor = "#292929";
                    } else {
                        // Toggling to add tracking
                        const emailBody = document.querySelector(
                            "div.dFCbN.dnzWM.dPKNh.DziEn.Z6_Ux"
                        );

                        // Get subject
                        const subjectInput = document.querySelector(
                            "input[placeholder='Add a subject']"
                        );
                        // Encode subject in image URL
                        const imageURL = `${SERVER_URL}${encodeURI(
                            subjectInput.value
                        )}`;
                        const imageTracker = `<div class="elementToProof"><img id="track-pixel" src="${imageURL}" style="display: none;"></div>`;

                        // Inject image
                        emailBody.insertAdjacentHTML(
                            "afterbegin",
                            imageTracker
                        );

                        // Toggle color of button
                        document.getElementById(
                            "track-button"
                        ).style.backgroundColor = "#333333";

                        // Add listener to subject change
                        subjectInput.addEventListener(
                            "input",
                            (event) => {
                                const trackPixel =
                                    document.querySelector("#track-pixel");
                                if (trackPixel) {
                                    // Update URL with new subject
                                    const newImageURL = `${SERVER_URL}${encodeURI(
                                        event.target.value
                                    )}`;
                                    trackPixel.src = newImageURL;
                                }
                            },
                            true
                        );
                    }
                },
                true
            );
        }
    }
};
