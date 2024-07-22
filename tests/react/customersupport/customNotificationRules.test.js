import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CustomNotificationRules from './customNotificationRules';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully creates custom notification rules.', async () => {
  fetchMock.post('/api/createCustomNotificationRule', 200);

  await act(async () => { render(<MemoryRouter><CustomNotificationRules /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ruleContent'), { target: { value: 'Rule' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Rule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Rule created')).toBeInTheDocument();
}, 10000);

test('Fails to create custom notification rules.', async () => {
  fetchMock.post('/api/createCustomNotificationRule', 500);

  await act(async () => { render(<MemoryRouter><CustomNotificationRules /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ruleContent'), { target: { value: 'Rule' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Rule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to create rule')).toBeInTheDocument();
}, 10000);

