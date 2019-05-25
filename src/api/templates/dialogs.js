// eslint-disable-next-line import/prefer-default-export
export const eotdSubmit = {
  callback_id: 'eotd_submit',
  title: 'Equation of the Day',
  submit_label: 'Preview',
  elements: [
    {
      label: 'Attribute',
      type: 'select',
      name: 'user',
      data_source: 'users',
      placeholder: 'Attribute to',
    },
    {
      label: 'Title',
      type: 'text',
      name: 'title',
      placeholder: 'Some Complicated formula',
      hint: 'Short and descriptive, 4-5 words.',
    },
    {
      label: 'Formula',
      type: 'textarea',
      name: 'latex',
      placeholder: '\\int_{-\\infty}^{\\infty} f(t)dt = 1', // \int_{-\infty}^{\infty} f(t)dt = 1
      hint: 'Any LaTeX supported...',
    },
  ],
};

export const eotdConfirm = {
  text: 'The following will be generated:',
  response_type: 'ephemeral',
  attachments: [{
    text: 'Does this look correct?',
    callback_id: 'eotd_confirm',
    actions: [
      {
        name: 'accept_eotd',
        text: 'Yes, Publish!',
        value: 'accept',
        type: 'button',
        style: 'primary',
      },
      {
        name: 'accept_eotd',
        text: 'Nope, Try Again',
        value: 'deny',
        type: 'button',
        style: 'danger',
      },
      {
        name: 'accept_eotd',
        text: 'Don\'t Worry, Cancel',
        value: 'cancel',
        type: 'button',
        style: 'default',
      },
    ],
  }],
};
