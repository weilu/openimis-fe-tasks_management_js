import React from 'react';
import { Grid, Divider, Typography } from '@material-ui/core';
import {
  withModulesManager,
  FormPanel,
  TextInput,
  FormattedMessage,
} from '@openimis/fe-core';
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from '@material-ui/core/styles';
import TaskExecutorsPicker from '../../pickers/TaskExecutorsPicker';
import GroupPolicyPicker from '../../pickers/GroupPolicyPicker';
import TaskSourcePicker from '../../pickers/TaskSourcePicker';
import TaskSourceAllowedPicker from '../../pickers/TaskSourceAllowedPicker';
import { TASK_GROUP_UPDATE, TASK_GROUP_CREATE } from '../../constants';

const styles = (theme) => ({
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: '100%',
  },
});

const renderHeadPanelTitle = (classes) => (
  <Grid container className={classes.tableTitle}>
    <Grid item>
      <Grid
        container
        align="center"
        justify="center"
        direction="column"
        className={classes.fullHeight}
      >
        <Grid item>
          <Typography>
            <FormattedMessage module="tasksManagement" id="taskGroup.detailsPage.headPanelTitle" />
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);

class TaskGroupHeadPanel extends FormPanel {
  render() {
    const {
      edited, classes, readOnly,
    } = this.props;
    const taskGroup = { ...edited };
    const { rights } = this.props;
    const filterAllowedSources = (options) => {
      if (!taskGroup?.taskAllowedSources?.length) {
        return options;
      }
      const sourcesIds = taskGroup.taskAllowedSources.map((source) => source.id);
      return options.filter((option) => sourcesIds.includes(option.id));
    };
    return (
      <>
        {renderHeadPanelTitle(classes)}
        <Divider />
        <Grid container className={classes.item}>
          <Grid item xs={3} className={classes.item}>
            <TextInput
              module="tasksManagement"
              label="taskGroup.code"
              readOnly={readOnly}
              value={taskGroup?.code}
              onChange={(code) => this.updateAttribute('code', code)}
              required
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <GroupPolicyPicker
              label="taskGroup.completionPolicy"
              withLabel
              readOnly={readOnly}
              withNull={false}
              value={taskGroup?.completionPolicy}
              onChange={(completionPolicy) => this.updateAttribute('completionPolicy', completionPolicy)}
              required
            />
          </Grid>
          <Grid item xs={6} className={classes.item}>
            <TaskExecutorsPicker
              required
              readOnly={readOnly}
              groupId={taskGroup?.uuid}
              value={taskGroup?.taskexecutorSet}
              onChange={(executors) => this.updateAttribute('taskexecutorSet', executors)}
            />
          </Grid>
          <Grid item xs={6} className={classes.item}>
            <TaskSourcePicker
              readOnly={readOnly}
              value={taskGroup?.taskSources}
              onChange={(sources) => this.updateAttribute('taskSources', sources)}
              filterOptions={filterAllowedSources}
            />
          </Grid>
          <Grid item xs={6} className={classes.item}>
            <TaskSourceAllowedPicker
              readOnly={!(rights.includes(TASK_GROUP_CREATE) || rights.includes(TASK_GROUP_UPDATE))}
              value={taskGroup?.taskAllowedSources}
              onChange={(allowedSources) => this.updateAttribute('taskAllowedSources', allowedSources)}
            />
          </Grid>
        </Grid>
      </>
    );
  }
}

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(TaskGroupHeadPanel))));
