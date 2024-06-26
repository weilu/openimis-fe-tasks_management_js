import React from 'react';
import { Autocomplete, useTranslations, useModulesManager } from '@openimis/fe-core';
import { TASK_CONTRIBUTION_KEY } from '../constants';

function TaskSourceAllowedPicker({
  onChange, readOnly, required, withLabel, value,
}) {
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations('tasksManagement');
  const contributions = modulesManager.getContribs(TASK_CONTRIBUTION_KEY);
  const allowedSources = contributions.flatMap((contribution) => {
    const source = contribution.taskSource;
    return source ? source.map((item) => ({ id: item, name: item })) : [];
  });

  return (
    <Autocomplete
      multiple
      required={required}
      label={formatMessage('TaskSourceAllowedPicker.label')}
      placeholder={formatMessage('TaskSourceAllowedPicker.placeholder')}
      readOnly={readOnly}
      withLabel={withLabel}
      withPlaceholder={!value?.length}
      options={allowedSources}
      value={value}
      getOptionLabel={(source) => `${source.name}`}
      onChange={onChange}
      filterSelectedOptions
      onInputChange={() => {}}
    />
  );
}

export default TaskSourceAllowedPicker;
