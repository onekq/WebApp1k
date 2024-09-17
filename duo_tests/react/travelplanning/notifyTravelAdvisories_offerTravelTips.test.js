import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './notifyTravelAdvisories_offerTravelTips';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('should render travel tips and local customs information', async () => {
  fetchMock.get('/api/tips', { tips: ['Avoid peak travel times', 'Learn basic phrases'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'France' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Tips')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Avoid peak travel times')).toBeInTheDocument();
}, 10000);

test('should show error if fetching travel tips fails', async () => {
  fetchMock.get('/api/tips', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'France' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Tips')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load tips')).toBeInTheDocument();
}, 10000);