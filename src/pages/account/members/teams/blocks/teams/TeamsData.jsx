const TeamsData = [];
const username = "drcurves";
const password = "drCurves#!@@@";

const encodedCredentials = btoa(`${username}:${password}`);



fetch('https://localhost:5078/api/User/all?companyId=1', {
  method: 'GET',
  headers: {
    'Authorization': `Basic ${encodedCredentials}`,
    'Content-Type': 'application/json'  // You may also need this header depending on your API
  },
})
  .then((response) => response.json())
  .then((data) => {
    // Loop through each user in the response and fill the TeamsData array
    data.forEach((user) => {
      // Convert dateOfBirth to dd-mm-yyyy format
      const rawDate = new Date(user.dateOfBirth);
      const formattedDate = `${String(rawDate.getDate()).padStart(2, '0')}-${String(rawDate.getMonth() + 1).padStart(2, '0')}-${rawDate.getFullYear()}`;

      TeamsData.push({
        name: `${user.firstName} ${user.lastName}`, // Filling firstName + lastName
        email: user.email, // Filling email
        userName: user.userName,
        dateOfBirth: formattedDate, // Use the formatted date
        userId: user.userId,
        team: {
          name: `${user.firstName} ${user.lastName}`, // Filling firstName + lastName
          description: user.email // Filling email
        },
        rating: {
          value: user.userName, // Filling userName
          round: 0 // Default value, adjust if needed
        },
        lastModified: formattedDate, // Use the formatted date
        members: {
          size: 'size-[30px]', // Assuming this is a static value, if dynamic, adjust accordingly
          group: [
            { filename: '300-4.png' }, // Static data; you can adjust dynamically if required
            { filename: '300-1.png' },
            { filename: '300-2.png' }
          ],
          more: {
            number: user.userId, // Filling userId
            variant: 'text-success-inverse ring-success-light bg-success' // Static value, adjust if dynamic
          }
        }
      });
    });
  });

export { TeamsData };
