// app/layout.tsx
import { WhopApp } from "@whop/react/components";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { getCurrentUser } from "@/app/lib/auth";
import "../../globals.css";

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ experienceId: string }>;
}) {
    // Get initial user data server-side
    const initialUser = await getCurrentUser();
    const { experienceId } = await params;

    return (
        <html lang="en">
            <body>
                <WhopApp accentColor="blue" appearance="inherit">
                    <AuthProvider initialUser={initialUser} experienceId={experienceId}>
                        {children}
                    </AuthProvider>
                </WhopApp>
            </body>
        </html>
    );
}