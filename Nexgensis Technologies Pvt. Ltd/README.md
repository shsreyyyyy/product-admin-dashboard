Product Admin Dashboard

A small product admin dashboard built with Next.js, React, Tailwind CSS, and Axios using the DummyJSON API.

Run Locally
npm install
npm run dev

Then open:

http://localhost:3000

Demo login:

Username: emilys
Password: emilyspass
Features Completed
Login and logout
Protected product pages
Shared Axios setup with authentication token handling
Product table for desktop
Product cards for mobile
Pagination with 10, 20, and 50 items per page
Debounced product search
Category filtering
Sorting by price, rating, and title
Search, filter, sort, page, and page size stored in the URL
Product details page
Not-found handling for invalid product IDs
Add and edit product forms with validation
Delete confirmation
Loading, empty, and error states
Retry option when an API request fails
Protection against multiple login/save requests
Invalid URL parameters are handled safely
Some Implementation Notes
Search and Category Filter

DummyJSON has separate endpoints for searching products and filtering by category, and they cannot be combined directly.

Because of this, when a search term is entered, the app uses the search endpoint:

/products/search?q=

In that situation, the category filter is not applied to the API request. The selected category is still kept in the URL so that the user's selection is not lost.

Add, Edit and Delete

DummyJSON's add, update, and delete APIs are mainly for simulating these operations. The changes are not permanently stored on the server.

After a successful request, the dashboard updates its current data so the user can see the change immediately. If the page is refreshed, the original DummyJSON data may appear again.

Search Request Handling

Search has a 450ms debounce, so the API is not called for every keystroke.

I also added request cancellation and a check to make sure that an older request cannot overwrite the result of a newer search. This is useful when the API response is slow.

URL Parameters

The current page, page size, search term, category, and sorting option are kept in the URL. This makes it possible to refresh or share the page without losing the current state.

Invalid values such as page=abc or an out-of-range page are handled by the application instead of breaking the page.

Problem I Faced

One issue was handling search requests when the user types quickly. A previous API request could finish after the latest request and potentially replace the newer results.

I fixed this by using a debounce along with request cancellation and checking whether the response belongs to the latest request before updating the product list.

AI Usage

I used AI mainly to help with the initial project structure, some repetitive UI code, and API-related boilerplate.

I reviewed and modified the generated code while building the application and made sure I understood the implementation so I can explain the code and make changes during the interview.

Deployment

The project can be deployed on Vercel directly from the GitHub repository.

No environment variables are required because the project uses the public DummyJSON API.