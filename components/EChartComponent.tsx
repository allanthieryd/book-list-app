import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

interface EChartComponentProps {
  option: any;
  height?: number;
}

const EChartComponent: React.FC<EChartComponentProps> = ({ option, height = 300 }) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            height: 100vh;
            width: 100vw;
            overflow: hidden;
          }
          #chart {
            width: 100%;
            height: 100vh;
          }
        </style>
      </head>
      <body>
        <div id="chart"></div>
        <script>
          try {
            const chart = echarts.init(document.getElementById('chart'));
            const option = ${JSON.stringify(option)};
            chart.setOption(option);

            window.addEventListener('resize', () => {
              chart.resize();
            });
          } catch (error) {
            console.error('Error initializing chart:', error);
          }
        </script>
      </body>
    </html>
  `;

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        scrollEnabled={false}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="small" color="#007AFF" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
  },
  webview: {
    backgroundColor: 'transparent',
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EChartComponent;
