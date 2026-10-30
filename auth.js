/* ========================================
   PRISTINE — AUTHENTICATION
   ======================================== */

(function () {
  const client = window.pristineSupabase;

  if (!client) {
    console.error("Pristine: Supabase client is not initialised.");
    return;
  }

  let isSignUpMode = false;

  // Expose authentication helpers for testing and future integration.
  window.pristineSignUp = async function (email, password) {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/index.html"
      }
    });

    if (error) throw error;
    return data;
  };

  window.pristineSignIn = async function (email, password) {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  };

  window.pristineSignOut = async function () {
    const { error } = await client.auth.signOut();
    if (error) throw error;
  };

  window.pristineResetPassword = async function (email) {
    const { data, error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/index.html"
    });

    if (error) throw error;
    return data;
  };

  window.pristineGetUser = async function () {
    const { data, error } = await client.auth.getUser();
    if (error) throw error;
    return data.user;
  };

  // Connect the authentication screen to Supabase.
  function initialiseAuthInterface() {
    const screen = document.getElementById("auth-screen");
    const form = document.getElementById("auth-form");
    const emailInput = document.getElementById("auth-email");
    const passwordInput = document.getElementById("auth-password");
    const heading = document.getElementById("auth-heading");
    const description = document.getElementById("auth-description");
    const submitButton = document.getElementById("auth-submit");
    const toggleButton = document.getElementById("auth-toggle");
    const forgotButton = document.getElementById("auth-forgot");
    const message = document.getElementById("auth-message");
    const appShell = document.querySelector(".app-shell");
    const accountPanel = document.getElementById("account-panel");
const accountEmail = document.getElementById("account-email");
const logoutButton = document.getElementById("account-logout");

    if (!screen || !form || !appShell) {
      console.error(
        "Pristine: Could not find the authentication screen or planner."
      );
      return;
    }

    function showMessage(text, isSuccess = false) {
      message.textContent = text;
      message.style.color = isSuccess ? "#286d55" : "#a23c4b";
    }

    function updateMode() {
      heading.textContent = isSignUpMode
        ? "Create your account"
        : "Welcome to Pristine";

      description.textContent = isSignUpMode
        ? "Create a personal space for your goals, routines, and growth."
        : "A peaceful space for your goals, routines, and growth.";

      submitButton.textContent = isSignUpMode ? "Create Account" : "Log In";

      toggleButton.textContent = isSignUpMode
        ? "Already have an account? Log in"
        : "New to Pristine? Create an account";

      passwordInput.autocomplete = isSignUpMode
        ? "new-password"
        : "current-password";

      forgotButton.hidden = isSignUpMode;
      showMessage("");
    }

    function showSignedOutScreen() {
  screen.hidden = false;
  appShell.hidden = true;

  if (accountPanel) {
    accountPanel.hidden = true;
  }
}

    function showPlanner(user = null) {
  screen.hidden = true;
  appShell.hidden = false;

  if (accountPanel) {
    accountPanel.hidden = false;
  }

  if (accountEmail) {
    accountEmail.textContent = user?.email || "Signed-in user";
  }
}

    toggleButton.addEventListener("click", function () {
      isSignUpMode = !isSignUpMode;
      updateMode();
    });





    if (logoutButton) {
  logoutButton.addEventListener("click", async function () {
    logoutButton.disabled = true;
    logoutButton.textContent = "Logging out...";

    try {
      await window.pristineSignOut();
    } catch (error) {
      console.error("Pristine: Logout failed.", error);
      showMessage(error.message || "Unable to log out. Please try again.");

      logoutButton.disabled = false;
      logoutButton.textContent = "Log Out";
    }
  });
}

    forgotButton.addEventListener("click", async function () {
      const email = emailInput.value.trim();

      if (!email) {
        showMessage("Enter your email address first.");
        emailInput.focus();
        return;
      }

      forgotButton.disabled = true;
      showMessage("Requesting password-reset email...", true);

      try {
        await window.pristineResetPassword(email);
        showMessage(
          "If an account exists for this email, a password-reset email will be sent. Check your inbox and spam folder.",
          true
        );
      } catch (error) {
        showMessage(error.message || "Unable to request a password reset.");
      } finally {
        forgotButton.disabled = false;
      }
    });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      submitButton.disabled = true;
      showMessage(isSignUpMode ? "Creating your account..." : "Logging in...", true);

      try {
        if (isSignUpMode) {
          const result = await window.pristineSignUp(email, password);

          if (result.session) {
            showPlanner(result.session.user);
          } else {
            showMessage(
              "Account request received! Check your email to confirm your account before logging in.",
              true
            );
          }
        } else {
          await window.pristineSignIn(email, password);
          showPlanner();
        }
      } catch (error) {
        showMessage(error.message || "Something went wrong. Please try again.");
      } finally {
        submitButton.disabled = false;
      }
    });

    updateMode();

    client.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        showPlanner(session.user);
      } else {
        showSignedOutScreen();
      }

      window.dispatchEvent(
        new CustomEvent("pristine-auth-change", {
          detail: {
            event,
            user: session?.user ?? null
          }
        })
      );
    });

    // Check the initial session after registering the listener.
    client.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Pristine: Unable to check session.", error);
        showSignedOutScreen();
        return;
      }

      if (data.session?.user) {
        showPlanner(data.session.user);
      } else {
        showSignedOutScreen();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiseAuthInterface, {
      once: true
    });
  } else {
    initialiseAuthInterface();
  }
})();