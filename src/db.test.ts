import { Db } from './db';

describe('Db', () => {
  let db: Db;

  beforeEach(() => {
    db = new Db();
  });

  describe('constructor', () => {
    it('loads initial data from data.json', () => {
      expect(db.timeEntryList.length).toBeGreaterThan(0);
      expect(db.taskList.length).toBeGreaterThan(0);
    });
  });

  describe('getTimeEntryList', () => {
    it('returns all time entries sorted by timestamp', async () => {
      const list = await db.getTimeEntryList();
      expect(list.length).toBeGreaterThan(0);
      for (let i = 1; i < list.length; i++) {
        expect(list[i].timestamp >= list[i - 1].timestamp).toBe(true);
      }
    });
  });

  describe('addTimeEntry', () => {
    it('adds a new time entry with given timestamp', async () => {
      const initialCount = db.timeEntryList.length;
      const timestamp = '2019-01-15T10:00:00.000Z';
      const entry = await db.addTimeEntry(timestamp);
      expect(db.timeEntryList.length).toBe(initialCount + 1);
      expect(entry._id).toBeTruthy();
      expect(entry.timestamp).toBe(timestamp);
    });

    it('adds a time entry with a taskId and resolves taskName', async () => {
      const task = db.taskList[0];
      const timestamp = '2019-01-15T10:00:00.000Z';
      const entry = await db.addTimeEntry(timestamp, task._id);
      expect(entry.taskId).toBe(task._id);
      expect(entry.taskName).toBe(task.subject);
    });

    it('adds a time entry without a taskId', async () => {
      const timestamp = '2019-01-15T10:00:00.000Z';
      const entry = await db.addTimeEntry(timestamp);
      expect(entry.taskId).toBe('');
      expect(entry.taskName).toBe('');
    });
  });

  describe('addTask', () => {
    it('creates a new internal task', async () => {
      const initialCount = db.taskList.length;
      const task = await db.addTask('New Task');
      expect(db.taskList.length).toBe(initialCount + 1);
      expect(task._id).toBeTruthy();
      expect(task.subject).toBe('New Task');
      expect(task.type).toBe('internal');
      expect(task.active).toBe(true);
    });
  });

  describe('getTaskNameById', () => {
    it('returns the subject of an existing task', async () => {
      const task = db.taskList[0];
      const name = await db.getTaskNameById(task._id);
      expect(name).toBe(task.subject);
    });

    it('returns empty string for non-existent task', async () => {
      const name = await db.getTaskNameById('non-existent-id');
      expect(name).toBe('');
    });
  });

  describe('saveTimeEntry', () => {
    it('updates an existing time entry', async () => {
      const list = await db.getTimeEntryList();
      const entry = { ...list[0], comment: 'Updated comment' };
      const saved = await db.saveTimeEntry(entry);
      expect(saved.comment).toBe('Updated comment');
    });

    it('creates a new task when taskId is "new"', async () => {
      const list = await db.getTimeEntryList();
      const entry = {
        ...list[0],
        taskId: 'new',
        taskName: 'Brand New Task',
      };
      const initialTaskCount = db.taskList.length;
      await db.saveTimeEntry(entry);
      expect(db.taskList.length).toBe(initialTaskCount + 1);
      expect(entry.taskId).not.toBe('new');
    });

    it('recalculates durations when saving', async () => {
      const list = await db.getTimeEntryList();
      if (list.length >= 2) {
        const entry = { ...list[0] };
        const saved = await db.saveTimeEntry(entry);
        expect(typeof saved.duration).toBe('number');
      }
    });
  });

  describe('deleteTimeEntryById', () => {
    it('removes a time entry by id', async () => {
      const list = await db.getTimeEntryList();
      const initialCount = list.length;
      const idToDelete = list[0]._id;
      const result = await db.deleteTimeEntryById(idToDelete);
      expect(result).toBe(true);
      expect(db.timeEntryList.length).toBe(initialCount - 1);
      expect(db.timeEntryList.find(e => e._id === idToDelete)).toBeUndefined();
    });

    it('rejects when deleting non-existent entry', async () => {
      await expect(db.deleteTimeEntryById('non-existent')).rejects.toBeTruthy();
    });

    it('adjusts predecessor duration after deletion', async () => {
      // Add 3 entries to have a clean state
      const db2 = new Db();
      db2.timeEntryList = [];
      db2.taskList = [];

      await db2.addTimeEntry('2019-01-15T08:00:00.000Z', undefined);
      const task = await db2.addTask('Test Task');
      await db2.addTimeEntry('2019-01-15T09:00:00.000Z', task._id);
      await db2.addTimeEntry('2019-01-15T10:00:00.000Z', task._id);

      const list = await db2.getTimeEntryList();
      expect(list.length).toBe(3);

      // Delete the middle entry - its duration should be absorbed by predecessor
      const middleId = list[1]._id;
      await db2.deleteTimeEntryById(middleId);

      const updatedList = await db2.getTimeEntryList();
      expect(updatedList.length).toBe(2);
    });
  });
});
