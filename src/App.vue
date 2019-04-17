<template>
  <q-layout view="lhh LpR lff">

    <q-header reveal class="bg-deep-purple-6">
      <q-toolbar>
        <q-toolbar-title>
          Тестовое задание
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-md" style="overflow-x: hidden;">

        <div class="row q-col-gutter-md">

          <div class="col-8">
            <q-input
              v-model="source.text"
              :error="!!source.error.length"
              :error-message="source.error"
              label="Входные данные"
              hint="Двумерный json массив"
              type="textarea"
              outlined
              :input-style="{ height: '200px' }"
            />
          </div>

          <div class="col-4">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <p>Диапазон значений</p>
                <q-range
                  v-model="generator.val"
                  :min="0"
                  :max="999"
                  :step="1"
                  label
                  label-always
                  color="purple"
                />
              </div>

              <div class="col-12">
                <p>Количество категорий</p>
                <q-range
                  v-model="generator.len"
                  :min="1"
                  :max="30"
                  :step="1"
                  label
                  label-always
                  color="purple"
                />
              </div>

              <div class="col-12 q-gutter-md">
                <q-btn @click="generateData(); buildGraph();" color="red" icon="my_location" />
                <q-btn @click="generateData">Гинерировать данные</q-btn>
                <q-btn @click="buildGraph" color="purple">Построить график</q-btn>
              </div>
            </div>
          </div>

          <div class="col-12">
            <div>
              <div ref="chart"></div>
            </div>
          </div>
        </div>

      </q-page>

    </q-page-container>

    <q-footer>
      <q-toolbar>
        <q-toolbar-title>Footer</q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
  const Highcharts = require('highcharts');

  export default {
    name: 'App',
    data() {
      return {
        // Параметры гинератора данных
        generator: {
          // Диапазон значений
          val: {
            min: 0,
            max: 100,
          },
          // Диапазон колличества категорий
          len: {
            min: 3,
            max: 15
          }
        },
        source: {
          text: '[]',
          error: ''
        },
        heightOffset: 128
      }
    },
    mounted() {
      this.buildGraph();
      this.generateData();
      this.buildGraph();
    },
    methods: {
      /**
       * Гинерировать случайное целое число.
       * @param {Object} range - Диапазон гинерируемых значение.
       * @param {String} range.min - Минимальное значение.
       * @param {String} range.max - Максимальное значение.
       */
      getRandInt({ min, max }) {
        return min !== max ? Math.floor(min + Math.random() * (max + 1 - min)) : min;
      },
      /**
       * Гинерировать массив случайных целых чисел
       * @param {Number} len - Длина массива.
       * @returns {Array}
       */
      getRandIntArray(len) {
        const list = [];

        for(let i = 0; i < len; i++) {
          list.push(this.getRandInt(this.generator.val))
        }

        return list;
      },
      /**
       * Гинерировать набор входных данных
       */
      generateData() {
        const categoryCount = this.getRandInt(this.generator.len);
        const categories = [];

        for(let i = 0; i < categoryCount; i++) {
          categories.push(this.getRandIntArray(categoryCount))
        }

        Object.assign(this.source, {
          text: JSON.stringify(categories),
          error: ''
        });
      },
      /**
       * Построить диаграмму
       */
      buildGraph() {
        try {
          this.source.error = '';

          const data = JSON.parse(this.source.text);

          if(!Array.isArray(data))
            throw new Error('Не верный формат данных');

          // Подготавливаем данные для построения графика.

          const categories = [];
          const series = [];
          data.forEach((item, index) => {
            categories.push(index + 1);
            series.push({
              name: index + 1,
              data: item
            })
          });

          Highcharts.chart(this.$refs.chart, {
            chart: {
              // тип диаграммы
              type: 'bar',
              // Для задания одинаковой толщины "баров" расчитываем высоту блока диаграммы в зависимости от количества категорий
              // плюс смещение равное сумме высот тайтлов диаграммы. Больше похоже на кастыль, но другого способа не нашел.
              // Ну и если этот способ использовать, то по хорошему оффсет надо динамически считать при инициализации страницы,
              // т.к. его значение может плавать в зависимости от параметров девайса.
              height: (categories.length * 50) + this.heightOffset,
            },
            title: {
              text: 'График распределения данных'
            },
            xAxis: {
              categories: categories
            },
            yAxis: {
              title: {
                text: 'процентное соотношение'
              }
            },
            plotOptions: {
              series: {
                stacking: 'percent',
              },
              bar: {
                dataLabels: {
                  enabled: true
                }
              }
            },
            series: series
          });

        } catch (e) {
          this.source.error = e.message;
        }
      }
    }
  }
</script>

<style>
</style>