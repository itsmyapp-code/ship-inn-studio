import '../globals.css'

export const metadata = {
    title: 'Outstatic Admin',
    description: 'Administration Panel',
}

export default function OutstaticLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body id="outstatic">
                {children}
            </body>
        </html>
    )
}
