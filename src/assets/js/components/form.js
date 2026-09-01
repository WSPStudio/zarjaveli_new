import { successSubmitForm } from "../scripts/forms/validation";
import { allForms } from "../scripts/variables";

/* 
  ================================================
	  
  Отправка форм
	
  ================================================
*/

export function form() {
  allForms.forEach((form) => {
    const action = (form.getAttribute("action") || "").trim();

    if (form.classList.contains("wpcf7-form") || (action !== "" && action !== "mail.php" && action !== "/mail.php")) {
      return;
    }

    if (!form.hasAttribute("enctype")) {
      form.setAttribute("enctype", "multipart/form-data");
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      form.classList.add("sending");

      try {
        const formData = new FormData(form);

        const mailResponse = await fetch("/mail.php", {
          method: "POST",
          body: formData,
        });

        let wpSuccess = true;

        const wpFormData = new FormData(form);
        wpFormData.append("action", "submit_request");

        const wpResponse = await fetch("/wp-admin/admin-ajax.php", {
          method: "POST",
          body: wpFormData,
          credentials: "same-origin",
        });

        if (wpResponse.ok) {
          const contentType = wpResponse.headers.get("content-type") || "";

          if (contentType.includes("application/json")) {
            const wpResult = await wpResponse.json();
            wpSuccess = wpResult.success;
          }
        }

        if (mailResponse.ok && wpSuccess) {
          successSubmitForm(form.dataset.thankModal);
        } else {
          console.error("Ошибка при отправке", {
            mail: mailResponse.status,
            wp: wpSuccess,
          });
        }
      } catch (err) {
        console.error("Ошибка сети:", err);
      } finally {
        form.classList.remove("sending");
      }
    });
  });
}
