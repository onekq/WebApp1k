import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterHotels_notifyTravelAdvisories_searchHotels';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('filterHotels - filters hotels successfully based on criteria', async () => {
  fetchMock.get('/api/hotels?filters=star_5', {
    body: [{ id: 2, name: 'Luxury Hotel' }],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('filter-star-5'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Luxury Hotel')).toBeInTheDocument();
}, 10000);

test('filterHotels - shows error message when no hotels match the filters', async () => {
  fetchMock.get('/api/hotels?filters=star_5', {
    body: [],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('filter-star-5'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No hotels available')).toBeInTheDocument();
}, 10000);

test('should render travel advisories and alerts', async () => {
  fetchMock.get('/api/advisories', { advisories: ['Avoid downtown area', 'Check local news'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'Mexico' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Advisories')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Avoid downtown area')).toBeInTheDocument();
}, 10000);

test('should show error if fetching travel advisories fails', async () => {
  fetchMock.get('/api/advisories', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'Mexico' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Advisories')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load advisories')).toBeInTheDocument();
}, 10000);

test('searchHotels - should display hotel search results on successful search', async () => {
  fetchMock.get('/api/hotels?destination=Paris&dates=2023-01-01_to_2023-01-10&guests=2', {
    body: [{ id: 1, name: 'Hotel Paris' }],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('destination-input'), { target: { value: 'Paris' } });
    fireEvent.click(screen.getByTestId('search-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Hotel Paris')).toBeInTheDocument();
}, 10000);

test('searchHotels - should display an error message on search failure', async () => {
  fetchMock.get('/api/hotels?destination=Paris&dates=2023-01-01_to_2023-01-10&guests=2', {
    body: { message: 'Network Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('destination-input'), { target: { value: 'Paris' } });
    fireEvent.click(screen.getByTestId('search-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);
