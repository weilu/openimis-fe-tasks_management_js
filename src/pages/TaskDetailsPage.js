import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Form, Helmet,
  useHistory,
  useModulesManager,
  useTranslations,
  decodeId,
} from '@openimis/fe-core';
import _ from 'lodash';
import TaskHeadPanel from '../components/TaskHeadPanel';
import TaskPreviewPanel from '../components/TaskPreviewPanel';
import TaskApprovementPanel from '../components/TaskApprovementPanel';
import { fetchTask, updateTask } from '../actions';
import { TASK_STATUS as taskStatus } from '../constants';

const useStyles = makeStyles((theme) => ({
  page: theme.page,
}));

function TaskDetailsPage({
  rights,
  taskUuid,
  task,
  fetchTask,
  updateTask,
  currentUser,
}) {
  const modulesManager = useModulesManager();
  const classes = useStyles();
  const history = useHistory();
  const { formatMessage } = useTranslations('tasksManagement', modulesManager);
  const [editedTask, setEditedTask] = useState({});
  const back = () => history.goBack();

  useEffect(() => {
    if (taskUuid) {
      fetchTask(modulesManager, [`id: "${taskUuid}"`]);
    }
  }, [taskUuid]);

  useEffect(() => {
    if (task) {
      setEditedTask(task);
    }
  }, [task]);

  const doesTaskChange = () => {
    if (_.isEqual(task, editedTask)) return false;
    return true;
  };

  const isMandatoryFieldsEmpty = () => !editedTask?.taskGroup;

  const canSave = () => !isMandatoryFieldsEmpty() && doesTaskChange();

  const handleSave = () => {
    if (task?.id) {
      updateTask(
        editedTask,
        formatMessage('task.update.mutationLabel'),
      );
    }
  };

  const isCurrentUserInTaskGroup = () => {
    const taskExecutors = task?.taskGroup?.taskexecutorSet?.edges.map((edge) => decodeId(edge.node.user.id)) ?? [];
    return taskExecutors && taskExecutors.includes(currentUser?.id);
  };

  const panels = () => {
    const panels = [TaskPreviewPanel];
    if (task && isCurrentUserInTaskGroup() && task.status === taskStatus.ACCEPTED) {
      panels.push(TaskApprovementPanel);
    }
    return panels;
  };

  return (
    <div className={classes.page}>
      <Helmet title={formatMessage('benefitPlanTask.detailsPage.triage.title')} />
      <Form
        module="tasksManagement"
        title={formatMessage('benefitPlanTask.detailsPage.triage.title')}
        openDirty
        edited={editedTask}
        onEditedChanged={setEditedTask}
        back={back}
        mandatoryFieldsEmpty={isMandatoryFieldsEmpty}
        canSave={canSave}
        save={handleSave}
        readOnly
        HeadPanel={TaskHeadPanel}
        formatMessage={formatMessage}
        Panels={panels()}
        rights={rights}
        saveTooltip={formatMessage(
          `tasksManagement.saveButton.tooltip.${canSave() ? 'enabled' : 'disabled'}`,
        )}
      />
    </div>
  );
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchTask,
  updateTask,
}, dispatch);

const mapStateToProps = (state, props) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
  currentUser: !!state.core && !!state?.core?.user ? state.core.user : null,
  taskUuid: props.match.params.task_uuid,
  task: state.tasksManagement.task,
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetailsPage);
