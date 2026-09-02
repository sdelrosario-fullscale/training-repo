import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import App from '../App';
import { useCounterStore } from '../src/store/useCounterStore';

describe('App', () => {
  beforeEach(() => {
    useCounterStore.setState({ count: 0 });
  });

  it('renders the application foundation', async () => {
    await render(<App />);

    expect(
      screen.getByRole('header', { name: 'React Native foundation' }),
    ).toBeOnTheScreen();
    expect(
      await screen.findByText('Client and server state are ready.'),
    ).toBeOnTheScreen();
  });

  it('updates local state through the counter controls', async () => {
    await render(<App />);

    await fireEvent.press(
      screen.getByRole('button', { name: 'Increment counter' }),
    );

    expect(screen.getByLabelText('Count: 1')).toBeOnTheScreen();
  });
});
