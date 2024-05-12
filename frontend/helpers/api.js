export const fetchData = async (url, method = "GET", data = {}) => {
    try {
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: method === "GET" ? undefined : JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Fetch error:", error.message);
        throw error;
    }
};

export const checkAndUpdate = async (url, data = {}, userId) => {
    try {
        // Check if entry exists for the user
        const response = await fetch(`${url}/`);
        if (response.ok) {
            const existingData = await response.json();
            const existingEntry = existingData.find(
                (entry) => Number(entry.user_id) === Number(userId)
            );
            console.log(existingEntry);
            if (existingEntry) {
                // Jeśli istnieje wpis, zaktualizuj go za pomocą PATCH
                await fetchData(`${url}/${existingEntry._id}`, "PATCH", data);
                console.log("Entry updated successfully");
            } else {
                // Jeśli nie istnieje wpis, utwórz nowy za pomocą POST
                await fetchData(url, "POST", data);
                console.log("New entry added successfully");
            }
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
};

export const checkAndRegister = async (
    url,
    data = {},
    userLogin,
    updateProps
) => {
    try {
        const response = await fetch(`${url}/`);
        if (response.ok) {
            const existingData = await response.json();
            const existingEntry = existingData.find(
                (entry) =>
                    entry.userName === userLogin
            );
            if (existingEntry) {
                console.log("użytkownik istnieje w bazie, zaloguj się");
                updateProps({
                    show: true,
                    color: "error",
                    icon: "$error",
                    title: "Wystąpił błąd.",
                    text: "Taki użytkownik już istnieje, spróbuj się zalogować.",
                });
            } else {
                console.log("jestem");
                await fetchData(url, "POST", data);
                updateProps({
                    show: true,
                    color: "success",
                    icon: "$success",
                    title: "Udało się.",
                    text: "Użytkownik został zarejestrowany.",
                });
            }
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
};

export const checkAndLogin = async (
    url,
    data = {},
    userLogin,
    userPassword,
    updateProps,
    navigateToMenu
) => {
    try {
        const response = await fetch(`${url}/`);
        if (response.ok) {
            const existingData = await response.json();
            const existingEntry = existingData.find(
                (entry) =>
                entry.userName.toLowerCase() === userLogin.toLowerCase() &&
                entry.password === userPassword
            );
            if (existingEntry) {
                localStorage.setItem("login", userLogin);
                navigateToMenu(); // Wywołanie funkcji nawigacji do menu
            } else {
                updateProps({
                    show: true,
                    color: "error",
                    icon: "$error",
                    text: "Wystąpił błąd..",
                    color: "red",
                    title: "Dane logowania są niepoprawne.",
                });
            }
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
};
