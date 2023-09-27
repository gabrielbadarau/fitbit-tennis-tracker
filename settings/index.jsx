function CustomSettings(props) {
  return (
    <Page>
      <Section
        title={
          <Text bold align='center'>
            Background Color
          </Text>
        }
      >
        <ColorSelect
          settingsKey='background-color'
          centered={true}
          colors={[
            { color: 'black' },
            { color: '#1B2C40' },
            { color: 'teal' },
            { color: 'lightseagreen' },
            { color: 'mediumaquamarine' },
          ]}
        />
      </Section>

      <Section
        title={
          <Text bold align='center'>
            List of Opponents
          </Text>
        }
      >
        <AdditiveList
          settingsKey='opponents-list'
          addAction={<TextInput label='Add opponent' />}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(CustomSettings);
