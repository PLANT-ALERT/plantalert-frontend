function getDate(years_in_back: number): Date {
    const currentDate = new Date(); // Get current date
    const creationYear = currentDate.getFullYear() - years_in_back; // Subtract age from current year
    const creationDate = new Date(currentDate); // Copy current date
    creationDate.setFullYear(creationYear); // Set the calculated year
    return creationDate;
}