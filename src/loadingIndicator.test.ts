import { expect, test } from 'vitest';
import { newLoadingIndicatorView } from './loadingIndicator';

test('setLoading() shows the spinner element', () => {
    const spinnerElement = { style: { display: 'none' } } as unknown as HTMLDivElement;
    const buttonElement = { disabled: false } as unknown as HTMLButtonElement;
    const { setLoading } = newLoadingIndicatorView(spinnerElement, buttonElement);

    setLoading();

    expect(spinnerElement.style.display).toBe('block');
});

test('setLoading() disables the button element', () => {
    const spinnerElement = { style: { display: 'none' } } as unknown as HTMLDivElement;
    const buttonElement = { disabled: false } as unknown as HTMLButtonElement;
    const { setLoading } = newLoadingIndicatorView(spinnerElement, buttonElement);

    setLoading();

    expect(buttonElement.disabled).toBeTruthy();
});

test('setFinished() hides the spinner element', () => {
    const spinnerElement = { style: { display: 'none' } } as unknown as HTMLDivElement;
    const buttonElement = { disabled: false } as unknown as HTMLButtonElement;
    const { setFinished } = newLoadingIndicatorView(spinnerElement, buttonElement);

    setFinished();

    expect(spinnerElement.style.display).toBe('none');
});

test('setFinished() enables the button element', () => {
    const spinnerElement = { style: { display: 'none' } } as unknown as HTMLDivElement;
    const buttonElement = { disabled: false } as unknown as HTMLButtonElement;
    const { setFinished } = newLoadingIndicatorView(spinnerElement, buttonElement);

    setFinished();

    expect(buttonElement.disabled).toBeFalsy();
});
