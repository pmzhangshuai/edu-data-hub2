import type { SourceTable, TargetTable, TableField } from '@/types/mapping';

// 教务系统数据源的Mock表数据
export const mockAcademicTables: SourceTable[] = [
  {
    name: 'student',
    comment: '学生信息表',
    fieldCount: 50,
    rowCount: 100000,
    mappingStatus: 'mapped',
    fields: [
      { name: 'student_id', type: 'varchar(20)', comment: '学号', isPrimaryKey: true, nullable: false, length: 20 },
      { name: 'name', type: 'varchar(50)', comment: '姓名', isPrimaryKey: false, nullable: false, length: 50 },
      { name: 'gender', type: 'tinyint(1)', comment: '性别(0女1男)', isPrimaryKey: false, nullable: true, length: 1 },
      { name: 'birth_date', type: 'date', comment: '出生日期', isPrimaryKey: false, nullable: true },
      { name: 'enroll_date', type: 'date', comment: '入学日期', isPrimaryKey: false, nullable: true },
      { name: 'major_id', type: 'varchar(20)', comment: '专业ID', isPrimaryKey: false, nullable: true, length: 20 },
      { name: 'class_id', type: 'varchar(20)', comment: '班级ID', isPrimaryKey: false, nullable: true, length: 20 },
      { name: 'id_card', type: 'varchar(18)', comment: '身份证号', isPrimaryKey: false, nullable: true, length: 18 },
      { name: 'phone', type: 'varchar(20)', comment: '联系电话', isPrimaryKey: false, nullable: true, length: 20 },
      { name: 'email', type: 'varchar(100)', comment: '邮箱', isPrimaryKey: false, nullable: true, length: 100 },
    ]
  },
  {
    name: 'course',
    comment: '课程表',
    fieldCount: 30,
    rowCount: 5000,
    mappingStatus: 'mapping',
    fields: [
      { name: 'course_id', type: 'varchar(20)', comment: '课程编号', isPrimaryKey: true, nullable: false, length: 20 },
      { name: 'course_name', type: 'varchar(100)', comment: '课程名称', isPrimaryKey: false, nullable: false, length: 100 },
      { name: 'credit', type: 'decimal(3,1)', comment: '学分', isPrimaryKey: false, nullable: true },
      { name: 'hours', type: 'int', comment: '学时', isPrimaryKey: false, nullable: true },
      { name: 'teacher_id', type: 'varchar(20)', comment: '授课教师ID', isPrimaryKey: false, nullable: true, length: 20 },
      { name: 'dept_id', type: 'varchar(20)', comment: '开课院系ID', isPrimaryKey: false, nullable: true, length: 20 },
    ]
  },
  {
    name: 'score',
    comment: '成绩表',
    fieldCount: 20,
    rowCount: 5000000,
    mappingStatus: 'unmapped',
    fields: [
      { name: 'score_id', type: 'bigint', comment: '成绩记录ID', isPrimaryKey: true, nullable: false },
      { name: 'student_id', type: 'varchar(20)', comment: '学号', isPrimaryKey: false, nullable: false, length: 20 },
      { name: 'course_id', type: 'varchar(20)', comment: '课程编号', isPrimaryKey: false, nullable: false, length: 20 },
      { name: 'score', type: 'decimal(5,2)', comment: '成绩', isPrimaryKey: false, nullable: true },
      { name: 'semester', type: 'varchar(20)', comment: '学期', isPrimaryKey: false, nullable: true, length: 20 },
      { name: 'school_year', type: 'varchar(10)', comment: '学年', isPrimaryKey: false, nullable: true, length: 10 },
    ]
  },
  {
    name: 'teacher',
    comment: '教师信息表',
    fieldCount: 40,
    rowCount: 2000,
    mappingStatus: 'unmapped',
    fields: [
      { name: 'teacher_id', type: 'varchar(20)', comment: '教师工号', isPrimaryKey: true, nullable: false, length: 20 },
      { name: 'name', type: 'varchar(50)', comment: '姓名', isPrimaryKey: false, nullable: false, length: 50 },
      { name: 'gender', type: 'tinyint(1)', comment: '性别', isPrimaryKey: false, nullable: true, length: 1 },
      { name: 'title', type: 'varchar(50)', comment: '职称', isPrimaryKey: false, nullable: true, length: 50 },
      { name: 'dept_id', type: 'varchar(20)', comment: '院系ID', isPrimaryKey: false, nullable: true, length: 20 },
    ]
  }
];

// 目标系统标准表结构
export const mockTargetTables: TargetTable[] = [
  {
    name: 'ods_student',
    comment: '学生信息标准表',
    fields: [
      { name: 'id', type: 'VARCHAR(64)', required: true, comment: '主键ID' },
      { name: 'student_code', type: 'VARCHAR(32)', required: true, comment: '学号' },
      { name: 'student_name', type: 'VARCHAR(128)', required: true, comment: '姓名' },
      { name: 'gender', type: 'VARCHAR(10)', required: false, comment: '性别' },
      { name: 'gender_code', type: 'VARCHAR(10)', required: false, comment: '性别代码' },
      { name: 'birth_date', type: 'DATE', required: false, comment: '出生日期' },
      { name: 'enroll_date', type: 'DATE', required: false, comment: '入学日期' },
      { name: 'major_code', type: 'VARCHAR(32)', required: false, comment: '专业代码' },
      { name: 'class_code', type: 'VARCHAR(32)', required: false, comment: '班级代码' },
      { name: 'id_card_no', type: 'VARCHAR(32)', required: false, comment: '身份证号' },
      { name: 'phone', type: 'VARCHAR(32)', required: false, comment: '联系电话' },
      { name: 'email', type: 'VARCHAR(256)', required: false, comment: '邮箱' },
      { name: 'source_system', type: 'VARCHAR(32)', required: true, comment: '来源系统' },
      { name: 'create_time', type: 'DATETIME', required: true, comment: '创建时间' },
      { name: 'update_time', type: 'DATETIME', required: true, comment: '更新时间' },
    ]
  },
  {
    name: 'ods_course',
    comment: '课程信息标准表',
    fields: [
      { name: 'id', type: 'VARCHAR(64)', required: true, comment: '主键ID' },
      { name: 'course_code', type: 'VARCHAR(32)', required: true, comment: '课程编号' },
      { name: 'course_name', type: 'VARCHAR(256)', required: true, comment: '课程名称' },
      { name: 'credit', type: 'DECIMAL(5,2)', required: false, comment: '学分' },
      { name: 'course_hours', type: 'INT', required: false, comment: '学时' },
      { name: 'teacher_code', type: 'VARCHAR(32)', required: false, comment: '授课教师工号' },
      { name: 'dept_code', type: 'VARCHAR(32)', required: false, comment: '开课院系代码' },
      { name: 'source_system', type: 'VARCHAR(32)', required: true, comment: '来源系统' },
      { name: 'create_time', type: 'DATETIME', required: true, comment: '创建时间' },
      { name: 'update_time', type: 'DATETIME', required: true, comment: '更新时间' },
    ]
  },
  {
    name: 'ods_score',
    comment: '成绩信息标准表',
    fields: [
      { name: 'id', type: 'VARCHAR(64)', required: true, comment: '主键ID' },
      { name: 'student_code', type: 'VARCHAR(32)', required: true, comment: '学号' },
      { name: 'course_code', type: 'VARCHAR(32)', required: true, comment: '课程编号' },
      { name: 'score_value', type: 'DECIMAL(5,2)', required: false, comment: '成绩' },
      { name: 'semester', type: 'VARCHAR(32)', required: false, comment: '学期' },
      { name: 'school_year', type: 'VARCHAR(20)', required: false, comment: '学年' },
      { name: 'source_system', type: 'VARCHAR(32)', required: true, comment: '来源系统' },
      { name: 'create_time', type: 'DATETIME', required: true, comment: '创建时间' },
      { name: 'update_time', type: 'DATETIME', required: true, comment: '更新时间' },
    ]
  }
];
