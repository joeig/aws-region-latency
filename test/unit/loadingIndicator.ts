import test from 'ava';
import { newLoadingIndicatorView } from '../../src/loadingIndicator';

test('setLoading() shows the spinner element', (t) => {
    const spinnerElement = { style: { display: 'none' } } as unknown as HTMLDivElement;
    const buttonElement = { disabled: false } as unknown as HTMLButtonElement;
    const { setLoading } = newLoadingIndicatorView(spinnerElement, buttonElement);

    setLoading();

    t.is(spinnerElement.style.display, 'block');
});

test('setLoading() disables the button element', (t) => {
    const spinnerElement = { style: { display: 'none' } } as unknown as HTMLDivElement;
    const buttonElement = { disabled: false } as unknown as HTMLButtonElement;
    const { setLoading } = newLoadingIndicatorView(spinnerElement, buttonElement);

    setLoading();

    t.true(buttonElement.disabled);
});

test('setFinished() hides the spinner element', (t) => {
    const spinnerElement = { style: { display: 'none' } } as unknown as HTMLDivElement;
    const buttonElement = { disabled: false } as unknown as HTMLButtonElement;
    const { setFinished } = newLoadingIndicatorView(spinnerElement, buttonElement);

    setFinished();

    t.is(spinnerElement.style.display, 'none');
});

test('setFinished() enables the button element', (t) => {
    const spinnerElement = { style: { display: 'none' } } as unknown as HTMLDivElement;
    const buttonElement = { disabled: false } as unknown as HTMLButtonElement;
    const { setFinished } = newLoadingIndicatorView(spinnerElement, buttonElement);

    setFinished();

    t.false(buttonElement.disabled);
});
