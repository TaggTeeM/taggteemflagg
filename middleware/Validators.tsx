export const IsValidPhoneNumber = (number: string): boolean => {
    const usPattern = /^(?:\+1|1)?[ -.]?\(?([2-9]{1}[0-9]{2})\)?[ -.]?([2-9]{1}[0-9]{2})[ -.]?([0-9]{4})$/;
    const internationalPattern = /^\+\d{1,4}[ -.]\d{1,15}$/;

    return usPattern.test(number) || internationalPattern.test(number);
  };
