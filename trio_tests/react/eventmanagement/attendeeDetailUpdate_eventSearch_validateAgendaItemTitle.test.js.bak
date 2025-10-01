import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './attendeeDetailUpdate_eventSearch_validateAgendaItemTitle';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Attendee details are successfully updated', async () => {
  fetchMock.put('/update-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/update/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/update successful/i)).toBeInTheDocument();
}, 10000);

test('Attendee detail update fails if no changes detected', async () => {
  fetchMock.put('/update-attendee', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/update/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/no changes detected/i)).toBeInTheDocument();
}, 10000);

test('Displays accurate search results for events based on filters', async () => {
  fetchMock.get('/api/event/search?query=concert', { results: [{ name: 'Concert Event' }] });

  await act(async () => { render(<MemoryRouter><EventApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'concert' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Concert Event')).toBeInTheDocument();
}, 10000);

test('Displays error message when search results are unavailable', async () => {
  fetchMock.get('/api/event/search?query=concert', 404);

  await act(async () => { render(<MemoryRouter><EventApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'concert' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('No event results found')).toBeInTheDocument();
}, 10000);

test('Successfully validates agenda item title.', async () => {
  fetchMock.post('/api/validateAgendaItemTitle', { title: 'Valid Title' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('agenda-title-input'), { target: { value: 'Valid Title' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-agenda-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Title is valid')).toBeInTheDocument();
}, 10000);

test('Fails to validate missing agenda item title.', async () => {
  fetchMock.post('/api/validateAgendaItemTitle', { error: 'Title is required' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('agenda-title-input'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-agenda-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Title is required')).toBeInTheDocument();
}, 10000);
