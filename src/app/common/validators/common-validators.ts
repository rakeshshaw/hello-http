import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CommonValidators {
  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    if ((control.value as string).indexOf(" ") > 0) {
      return { cannotContainSpace: true };
    }
    return null;
  }

  static oldPasswordNotMatched(
    control: AbstractControl
  ): Promise<ValidationErrors | null> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (control.value !== "1234") {
          resolve({ oldPasswordNotMatched: true });
        } else {
          resolve(null);
        }
      }, 2000);
    });
  }

  static confirmPasswordNotMatched(
    control: AbstractControl
  ): ValidationErrors | null {
    let newPassword = control.get("newPassword");
    let confirmPassword = control.get("confirmPassword");
    if (newPassword.value !== confirmPassword.value) {
      return { confirmPasswordNotMatched: true };
    }
    return null;
  }
}
