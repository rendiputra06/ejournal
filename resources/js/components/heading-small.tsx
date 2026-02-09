export default function HeadingSmall({ title, description }: { title: string; description?: string }) {
    return (
        <header className="mb-4">
            <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">{title}</h3>
            {description && (
                <p className="text-sm font-light text-neutral-500 dark:text-neutral-400">
                    {description}
                </p>
            )}
        </header>
    );
}
