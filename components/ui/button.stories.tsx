import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Plus } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
    },
    children: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button Text',
    variant: 'default',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
};

export const WithIcon: Story = {
    args: {
      children: (
        <>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </>
      ),
      variant: 'outline',
    },
};

export const IconOnly: Story = {
    args: {
        children: <Plus className="h-4 w-4" />,
        size: 'icon',
    },
};
