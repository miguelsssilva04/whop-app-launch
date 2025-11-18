This is a template for a whop app built in NextJS. Fork it and keep the parts you need for your app.

# Whop NextJS App Boilerplate

To run this project:

1. Install dependencies with: `pnpm i`

2. Create a Whop App on your [whop developer dashboard](https://whop.com/dashboard/developer/), then go to the "Hosting" section and:
	- Ensure the "Base URL" is set to the domain you intend to deploy the site on.
	- Ensure the "App path" is set to `/experiences/[experienceId]`
	- Ensure the "Dashboard path" is set to `/dashboard/[companyId]`
	- Ensure the "Discover path" is set to `/discover`

3. Look at `.env.example` to see which variables are required, then copy them into a new `.env.development.local` file and fill in the real values from your Whop dashboard.  
   **For production:** copy all variables into the `apphosting.yaml` file.

4. **CRITICAL:** All secret keys (e.g., `WHOP_API_KEY`, `JWT_SECRET`, etc.) must be managed through the Firebase Console first, then referenced in the `apphosting.yaml` secrets section. Never commit these values to your repository to prevent leaks.

5. Go to a whop created in the same org as the app you created. Navigate to the tools section and add your app.

6. Run `pnpm dev` to start the dev server. Then in the top right of the window find a translucent settings icon. Select "localhost". The default port 3000 should work.

## Deploying

1. Upload your fork / copy of this template to github.

2. Go to [Firebase Hosting](https://console.firebase.google.com/project/_/hosting/sites) and link the repository. Deploy your application with the environment variables from your `.apphosting.yaml` file.

**CRITICAL:** All secret keys (e.g., `WHOP_API_KEY`, `JWT_SECRET`, etc.) must be managed through the Firebase Console first, then referenced in the `apphosting.yaml` secrets section. Never commit these values to your repository to prevent leaks.

3. If necessary update you "Base Domain" and webhook callback urls on the app settings page on the whop dashboard.

## Troubleshooting

**App not loading properly?** Make sure to set the "App path" in your Whop developer dashboard. The placeholder text in the UI does not mean it's set - you must explicitly enter `/experiences/[experienceId]` (or your chosen path name)
a

**Make sure to add env.local** Make sure to get the real app environment vairables from your whop dashboard and set them in .env.local


For more info, see our docs at https://dev.whop.com/introduction