// eslint-disable-next-line import/prefer-default-export
export const eotdSubmit = (values = {}) => ({
  callback_id: 'eotd_submit',
  title: 'Equation of the Day',
  submit_label: 'Preview',
  state: `${values._id || ''}`,
  elements: [
    {
      label: 'Attribute',
      type: 'select',
      name: 'user',
      value: values.user,
      data_source: 'users',
      placeholder: 'Attribute to',
    },
    {
      label: 'Title',
      type: 'text',
      name: 'title',
      value: values.title,
      placeholder: 'Some Complicated formula',
      hint: 'Short and descriptive, 4-5 words.',
    },
    {
      label: 'Formula',
      type: 'textarea',
      name: 'latex',
      value: values.latex,
      placeholder: '\\int_{-\\infty}^{\\infty} f(t)dt = 1', // \int_{-\infty}^{\infty} f(t)dt = 1
      hint: 'Any LaTeX supported...',
    },
  ],
});

export const eotdConfirm = (id = '', attachments) => ({
  text: 'The following will be generated:',
  response_type: 'ephemeral',
  attachments: [...attachments, {
    text: 'Does this look correct?',
    callback_id: 'eotd_confirm',
    actions: [
      {
        name: 'accept_eotd',
        text: 'Yes, Publish!',
        value: `accept:${id}`,
        type: 'button',
        style: 'primary',
      },
      {
        name: 'accept_eotd',
        text: 'Nope, Try Again',
        value: `deny:${id}`,
        type: 'button',
        style: 'danger',
      },
      {
        name: 'accept_eotd',
        text: 'Don\'t Worry, Cancel',
        value: `cancel:${id}`,
        type: 'button',
        style: 'default',
      },
    ],
  }],
});
