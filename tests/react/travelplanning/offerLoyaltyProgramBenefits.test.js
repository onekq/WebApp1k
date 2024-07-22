import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './offerLoyaltyProgramBenefits';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should render loyalty program benefits and reward points', async () => {
  fetchMock.get('/api/loyalty', { benefits: ['Double Points', 'Free Upgrades'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter loyalty program'), { target: { value: 'Frequent Flyer' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Benefits')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Double Points')).toBeInTheDocument();
}, 10000);

test('should show error if fetching loyalty program benefits fails', async () => {
  fetchMock.get('/api/loyalty', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter loyalty program'), { target: { value: 'Frequent Flyer' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Benefits')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load benefits')).toBeInTheDocument();
}, 10000);