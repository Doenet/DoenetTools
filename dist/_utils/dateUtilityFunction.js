export default dateUtilityFunction = (date, isTimeIncluded) => {
    const datepresent = new Date(Date.now());
    const diff = Math.floor(datepresent - date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60)) - days * 24;
    const minutes = Math.floor(diff / (1000 * 60)) - days * 24 * 60 - hours * 60;
    //console.log(days, hours, minutes);
    if (days === 0 && hours === 0 && minutes < 1) {
      return "Now";
    } else if (days < 1) {
      return hours + "h " + minutes + "m";
    } else if (days < 7) {
      return days + "d " + hours + "h ";
    }
    return (
      date.toLocaleDateString() +
      ", " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };
