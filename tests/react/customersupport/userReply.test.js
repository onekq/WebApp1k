import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import HelpDeskApp from './userReply';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Allowing users to reply to agent comments should show success message.', async () => {
  fetchMock.post('/api/user-reply', { success: true });

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-reply'), { target: { value: 'User reply' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-reply')); });

  expect(fetchMock.calls('/api/user-reply').length).toBe(1);
  expect(screen.getByText('Reply submitted successfully')).toBeInTheDocument();
}, 10000);

test('Allowing users to reply to agent comments should show error message when failed.', async () => {
  fetchMock.post('/api/user-reply', 500);

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-reply'), { target: { value: 'User reply' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-reply')); });

  expect(fetchMock.calls('/api/user-reply').length).toBe(1);
  expect(screen.getByText('Reply submission failed')).toBeInTheDocument();
}, 10000);

