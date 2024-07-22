import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ContactAgentForViewing from './contactAgentForViewing';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully contacts agent for viewing', async () => {
  fetchMock.post('/api/agent/contact', 200);

  await act(async () => { render(<MemoryRouter><ContactAgentForViewing /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('viewing-date'), { target: { value: '2023-10-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('contact-agent-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('contact-success')).toBeInTheDocument();
}, 10000);

test('fails to contact agent for viewing and shows error message', async () => {
  fetchMock.post('/api/agent/contact', 500);

  await act(async () => { render(<MemoryRouter><ContactAgentForViewing /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('viewing-date'), { target: { value: '2023-10-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('contact-agent-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('contact-error')).toBeInTheDocument();
}, 10000);

