interface LoadingIndicatorView {
    setLoading(): void;
    setFinished(): void;
}

export const newLoadingIndicatorView = (
    spinnerElement: Readonly<HTMLDivElement>,
    // eslint-disable-next-line functional/prefer-immutable-types
    buttonElement: HTMLButtonElement
): LoadingIndicatorView => {
    return {
        setLoading() {
            // eslint-disable-next-line no-param-reassign
            spinnerElement.style.display = 'block';
            // eslint-disable-next-line no-param-reassign
            buttonElement.disabled = true;
        },
        setFinished() {
            // eslint-disable-next-line no-param-reassign
            spinnerElement.style.display = 'none';
            // eslint-disable-next-line no-param-reassign
            buttonElement.disabled = false;
        }
    };
};
